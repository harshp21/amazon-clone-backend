//importing
import express, { Request, Response, Router } from 'express';
import { IUser, User } from '../../models/user/user';
import bycrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import crypto from 'crypto';
import { MailService } from '../../service/mail-service/mail-service';
import { authenticate } from '../../service/authentication-service/authentication-service';

// router config
const router: Router = express.Router();

router.post('/sign-in', async (req: Request, res: Response) => {
    try {
        const { emailId, password } = req.body;

        //check emailId and password are valid
        if (!validator.isEmail(emailId)) {
            res.status(401).json({
                message: 'Enter a valid email id',
            })
        } else if (password.length < 6) {
            res.status(401).json({
                message: 'Password length should be atleast 6',
            })
        } else {

            // check is user exists and authenticate the user
            const user: IUser = await User.findOne({ emailId });
            let isUserAuthenticated: boolean = await bycrypt.compare(password, user.password);

            // send a token id user is authenticated and active
            if (isUserAuthenticated && user.isActive) {
                let token: string = jwt.sign({ userId: user._id, emailId: user.emailId, username: user.username }, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: "1h" });
                res.json({
                    message: 'User logged In',
                    token,
                    user: {
                        email: user.emailId,
                        userId: user._id,
                        username: user.username
                    }
                })
            } else if (!user.isActive) {
                res.status(401).json({
                    message: 'Account is not activated',
                })
            } else {
                res.status(401).json({
                    message: 'Provided credentials are wrong please verify',
                })
            }
        }
    } catch (err) {
        res.status(401).json({
            message: 'user not found'
        })
    }
});

// handle user register
router.post('/register', async (req: Request, res: Response): Promise<void> => {
    try {
        const { emailId, username, password } = req.body;

        //check emailId, username and password are valid
        if (!validator.isEmail(emailId)) {
            res.status(401).json({
                message: 'Enter a valid email id',
            })
        } else if (password.length < 6) {
            res.status(401).json({
                message: 'Password length should be atleast 6',
            })
        } else if (username === '') {
            res.status(401).json({
                message: 'Username cannot be blank',
            })
        } else {

            // find is user exists with the help of email and handle accordingly 
            let user: IUser = await User.findOne({ emailId });
            if (user) {
                res.status(400).json({
                    message: "Email already registered"
                });
            } else if (!validator.isEmail(emailId)) {
                res.status(400).json({
                    message: 'Invalid  Email, please enter a valid email',
                })
            } else {
                // hash the password send by the user 
                let salt = await bycrypt.genSalt(10);
                let hashPassword = await bycrypt.hash(password, salt);

                // create a random string for activation code
                let activationCode: string = crypto.randomBytes(32).toString('hex');

                // insert the user in the db
                const newUser: IUser = new User({
                    emailId,
                    username,
                    address: '',
                    password: hashPassword,
                    activateAccountToken: activationCode,
                    activateAccountTokenExpiry: Date.now() + 300000,
                })
                const result = await newUser.save();

                // Set value to send for account activation
                const mailService = new MailService();
                const mailSubject = 'Account Activation for amazon-clone';
                const mailBody = `<div>
                                <h4>
                                 To activate the account please 
                                     <a href="${process.env.REQUEST_ORIGIN}/activate-account/${activationCode}">click here</a>
                                </h4>
                             </div>`;

                const mailTo = emailId;

                // send mail for account activation
                mailService.sendMail(mailSubject, mailBody, mailTo);

                // send response message 
                res.json({
                    message: `Mail has been sent to   ${mailTo}  for account activation`,
                    data: result
                })
            }
        }
    } catch (err) {
        console.log(err);
        res.status(400).json({
            message: "Unable to register user"
        })
    }
});

// verfiy account activation code and acivate the account and send jwt token
router.post('/activate-account/:activationCode', async (req: Request, res: Response): Promise<void> => {
    try {
        const { activationCode } = req.params;
        // find user if activation code is valid 
        let user = await User.findOne({ $and: [{ activateAccountToken: activationCode }, { activateAccountTokenExpiry: { $gt: Date.now() } }] });

        // if activation code is valid generate the jwt token and send it to client
        if (user) {
            user.isActive = true;
            user.activateAccountToken = '';
            user.activateAccountTokenExpiry = Date.now();
            await user.save();

            // redirect to the ui for login with success message
            const token: string = jwt.sign({ userId: user._id, email: user.emailId, username: user.username }, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: "1h" });
            res.json({
                message: 'Account activated successfully',
                token
            })
        } else {
            // redirect to the ui with error message
            res.json({
                message: 'Account activation failed, token expired'
            })
        }

    } catch (err) {
        console.log(err);
    }
});

// check if user is logged in
router.get('/isUserLoggedIn', authenticate, async (req: Request, res: Response): Promise<void> => {
    try {

        const { emailId, userId, username } = req.body;

        // check if user exists and is active
        let user = await User.findOne({ _id: req.body.userId });
        if (user && user.isActive) {
            res.json({
                message: "user is logged in",
                user: {
                    emailId,
                    userId,
                    username,
                }
            })
        } else {
            res.status(400).json({
                message: "User Does not exists",
            })
        }
    } catch (err) {
        console.log(err);
    }
});

// start the process of password recovery for valid user
router.post('/forgot-password', async (req: Request, res: Response) => {
    try {

        const { emailId } = req.body;

        if (!validator.isEmail(emailId)) {
            res.status(401).json({
                message: 'Enter a valid email id',
            })
        }
        // check if user exists with given email
        let user: IUser = await User.findOne({ emailId });
        if (user) {

            // create a token for reset password with expixy and update in db
            let resetToken = crypto.randomBytes(32).toString('hex');
            user.resetPasswordToken = resetToken;
            user.resetPasswordTokenExpiry = Date.now() + 30000;
            await user.save();

            // Send mail for account activation
            const mailService = new MailService();
            const mailSubject = 'Reset Password for amazon-clone';
            const mailBody = `<div>
                <h3>Reset Password</h3>
                <p>Please click the given link to reset your password <a target="_blank" href="${process.env.REQUEST_ORIGIN}/reset-password/${encodeURI(resetToken)}"> click here </a></p>
            </div>`;

            const mailTo = user.emailId;

            // send mail for account activation
            mailService.sendMail(mailSubject, mailBody, mailTo);

            //send response message for uesr
            res.json({
                message: `Mail has been sent to ${user.emailId}</h4> with further instructions`,
            })
        } else {
            res.status(400).json({
                message: 'User not found',
            })
        }

    } catch (err) {
        console.log(err);
    }
});

router.post('/reset-password', async (req: Request, res: Response) => {
    try {
        const { password, confirmPassword, token } = req.body;

        if (password !== confirmPassword) {
            res.status(401).json({
                message: 'Password and confirm password should be same'
            })
        } else {

            // check if the user exists with the given reset token and is not passed expiry time
            const user: IUser = await User.findOne({ $and: [{ resetPasswordToken: token, resetPasswordTokenExpiry: { $gt: Date.now() } }] });
            if (user && password === confirmPassword) {

                // hash the password send by the user 
                let salt = await bycrypt.genSalt(10);
                let hashPassword = await bycrypt.hash(password, salt);

                // Updating user password
                user.password = hashPassword;
                user.resetPasswordToken = '';
                user.resetPasswordTokenExpiry = Date.now();
                await user.save();

                // Send message for suucessfull password reset
                const mailService = new MailService();
                const mailSubject = 'Successfully Reset Password for amazon-clone';
                const mailBody = `<div>
                 <h3>Your password was reset successfully </h3>
             </div>`;

                const mailTo = user.emailId;

                // send mail for account activation
                mailService.sendMail(mailSubject, mailBody, mailTo);

                res.json({
                    message: "Password reset successfull check your mail for confirmation",
                    token,
                    data: {
                        email: user.emailId
                    }
                })
            } else {
                res.status(400).json({
                    message: "Failed to update password token invalid",
                })
            }
        }
    } catch (err) {
        console.log(err);
    }
})

export default router;