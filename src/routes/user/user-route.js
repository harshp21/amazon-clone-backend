"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//importing
var express_1 = __importDefault(require("express"));
var user_1 = require("../../models/user/user");
var bcrypt_1 = __importDefault(require("bcrypt"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var validator_1 = __importDefault(require("validator"));
var crypto_1 = __importDefault(require("crypto"));
var mail_service_1 = require("../../service/mail-service/mail-service");
var authentication_service_1 = require("../../service/authentication-service/authentication-service");
// router config
var router = express_1.default.Router();
router.post('/sign-in', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, emailId, password, user, isUserAuthenticated, token, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                _a = req.body, emailId = _a.emailId, password = _a.password;
                if (!!validator_1.default.isEmail(emailId)) return [3 /*break*/, 1];
                res.status(401).json({
                    message: 'Enter a valid email id',
                });
                return [3 /*break*/, 5];
            case 1:
                if (!(password.length < 6)) return [3 /*break*/, 2];
                res.status(401).json({
                    message: 'Password length should be atleast 6',
                });
                return [3 /*break*/, 5];
            case 2: return [4 /*yield*/, user_1.User.findOne({ emailId: emailId })];
            case 3:
                user = _b.sent();
                return [4 /*yield*/, bcrypt_1.default.compare(password, user.password)];
            case 4:
                isUserAuthenticated = _b.sent();
                // send a token id user is authenticated and active
                if (isUserAuthenticated && user.isActive) {
                    token = jsonwebtoken_1.default.sign({ userId: user._id, emailId: user.emailId, username: user.username }, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: "1h" });
                    res.json({
                        message: 'User logged In',
                        token: token,
                        user: {
                            email: user.emailId,
                            userId: user._id,
                            username: user.username
                        }
                    });
                }
                else if (!user.isActive) {
                    res.status(401).json({
                        message: 'Account is not activated',
                    });
                }
                else {
                    res.status(401).json({
                        message: 'Provided credentials are wrong please verify',
                    });
                }
                _b.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                err_1 = _b.sent();
                res.status(401).json({
                    message: 'user not found'
                });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
// handle user register
router.post('/register', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, emailId, username, password, user, salt, hashPassword, activationCode, newUser, result, mailService, mailSubject, mailBody, mailTo, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 11, , 12]);
                _a = req.body, emailId = _a.emailId, username = _a.username, password = _a.password;
                if (!!validator_1.default.isEmail(emailId)) return [3 /*break*/, 1];
                res.status(401).json({
                    message: 'Enter a valid email id',
                });
                return [3 /*break*/, 10];
            case 1:
                if (!(password.length < 6)) return [3 /*break*/, 2];
                res.status(401).json({
                    message: 'Password length should be atleast 6',
                });
                return [3 /*break*/, 10];
            case 2:
                if (!(username === '')) return [3 /*break*/, 3];
                res.status(401).json({
                    message: 'Username cannot be blank',
                });
                return [3 /*break*/, 10];
            case 3: return [4 /*yield*/, user_1.User.findOne({ emailId: emailId })];
            case 4:
                user = _b.sent();
                if (!user) return [3 /*break*/, 5];
                res.status(400).json({
                    message: "Email already registered"
                });
                return [3 /*break*/, 10];
            case 5:
                if (!!validator_1.default.isEmail(emailId)) return [3 /*break*/, 6];
                res.status(400).json({
                    message: 'Invalid  Email, please enter a valid email',
                });
                return [3 /*break*/, 10];
            case 6: return [4 /*yield*/, bcrypt_1.default.genSalt(10)];
            case 7:
                salt = _b.sent();
                return [4 /*yield*/, bcrypt_1.default.hash(password, salt)];
            case 8:
                hashPassword = _b.sent();
                activationCode = crypto_1.default.randomBytes(32).toString('hex');
                newUser = new user_1.User({
                    emailId: emailId,
                    username: username,
                    address: '',
                    password: hashPassword,
                    activateAccountToken: activationCode,
                    activateAccountTokenExpiry: Date.now() + 300000,
                });
                return [4 /*yield*/, newUser.save()];
            case 9:
                result = _b.sent();
                mailService = new mail_service_1.MailService();
                mailSubject = 'Account Activation for amazon-clone';
                mailBody = "<div>\n                                <h4>\n                                 To activate the account please \n                                     <a href=\"" + process.env.REQUEST_ORIGIN + "/activate-account/" + activationCode + "\">click here</a>\n                                </h4>\n                             </div>";
                mailTo = emailId;
                // send mail for account activation
                mailService.sendMail(mailSubject, mailBody, mailTo);
                // send response message 
                res.json({
                    message: "Mail has been sent to   " + mailTo + "  for account activation",
                    data: result
                });
                _b.label = 10;
            case 10: return [3 /*break*/, 12];
            case 11:
                err_2 = _b.sent();
                console.log(err_2);
                res.status(400).json({
                    message: "Unable to register user"
                });
                return [3 /*break*/, 12];
            case 12: return [2 /*return*/];
        }
    });
}); });
// verfiy account activation code and acivate the account and send jwt token
router.post('/activate-account/:activationCode', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var activationCode, user, token, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                activationCode = req.params.activationCode;
                return [4 /*yield*/, user_1.User.findOne({ $and: [{ activateAccountToken: activationCode }, { activateAccountTokenExpiry: { $gt: Date.now() } }] })];
            case 1:
                user = _a.sent();
                if (!user) return [3 /*break*/, 3];
                user.isActive = true;
                user.activateAccountToken = '';
                user.activateAccountTokenExpiry = Date.now();
                return [4 /*yield*/, user.save()];
            case 2:
                _a.sent();
                token = jsonwebtoken_1.default.sign({ userId: user._id, email: user.emailId, username: user.username }, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: "1h" });
                res.json({
                    message: 'Account activated successfully',
                    token: token
                });
                return [3 /*break*/, 4];
            case 3:
                // redirect to the ui with error message
                res.json({
                    message: 'Account activation failed, token expired'
                });
                _a.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                err_3 = _a.sent();
                console.log(err_3);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
// check if user is logged in
router.get('/isUserLoggedIn', authentication_service_1.authenticate, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, emailId, userId, username, user, err_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, emailId = _a.emailId, userId = _a.userId, username = _a.username;
                return [4 /*yield*/, user_1.User.findOne({ _id: req.body.userId })];
            case 1:
                user = _b.sent();
                if (user && user.isActive) {
                    res.json({
                        message: "user is logged in",
                        user: {
                            emailId: emailId,
                            userId: userId,
                            username: username,
                        }
                    });
                }
                else {
                    res.status(400).json({
                        message: "User Does not exists",
                    });
                }
                return [3 /*break*/, 3];
            case 2:
                err_4 = _b.sent();
                console.log(err_4);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// start the process of password recovery for valid user
router.post('/forgot-password', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var emailId, user, resetToken, mailService, mailSubject, mailBody, mailTo, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                emailId = req.body.emailId;
                if (!validator_1.default.isEmail(emailId)) {
                    res.status(401).json({
                        message: 'Enter a valid email id',
                    });
                }
                return [4 /*yield*/, user_1.User.findOne({ emailId: emailId })];
            case 1:
                user = _a.sent();
                if (!user) return [3 /*break*/, 3];
                resetToken = crypto_1.default.randomBytes(32).toString('hex');
                user.resetPasswordToken = resetToken;
                user.resetPasswordTokenExpiry = Date.now() + 30000;
                return [4 /*yield*/, user.save()];
            case 2:
                _a.sent();
                mailService = new mail_service_1.MailService();
                mailSubject = 'Reset Password for amazon-clone';
                mailBody = "<div>\n                <h3>Reset Password</h3>\n                <p>Please click the given link to reset your password <a target=\"_blank\" href=\"" + process.env.REQUEST_ORIGIN + "/reset-password/" + encodeURI(resetToken) + "\"> click here </a></p>\n            </div>";
                mailTo = user.emailId;
                // send mail for account activation
                mailService.sendMail(mailSubject, mailBody, mailTo);
                //send response message for uesr
                res.json({
                    message: "Mail has been sent to " + user.emailId + "</h4> with further instructions",
                });
                return [3 /*break*/, 4];
            case 3:
                res.status(400).json({
                    message: 'User not found',
                });
                _a.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                err_5 = _a.sent();
                console.log(err_5);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
router.post('/reset-password', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, password, confirmPassword, token, user, salt, hashPassword, mailService, mailSubject, mailBody, mailTo, err_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 8, , 9]);
                _a = req.body, password = _a.password, confirmPassword = _a.confirmPassword, token = _a.token;
                if (!(password !== confirmPassword)) return [3 /*break*/, 1];
                res.status(401).json({
                    message: 'Password and confirm password should be same'
                });
                return [3 /*break*/, 7];
            case 1: return [4 /*yield*/, user_1.User.findOne({ $and: [{ resetPasswordToken: token, resetPasswordTokenExpiry: { $gt: Date.now() } }] })];
            case 2:
                user = _b.sent();
                if (!(user && password === confirmPassword)) return [3 /*break*/, 6];
                return [4 /*yield*/, bcrypt_1.default.genSalt(10)];
            case 3:
                salt = _b.sent();
                return [4 /*yield*/, bcrypt_1.default.hash(password, salt)];
            case 4:
                hashPassword = _b.sent();
                // Updating user password
                user.password = hashPassword;
                user.resetPasswordToken = '';
                user.resetPasswordTokenExpiry = Date.now();
                return [4 /*yield*/, user.save()];
            case 5:
                _b.sent();
                mailService = new mail_service_1.MailService();
                mailSubject = 'Successfully Reset Password for amazon-clone';
                mailBody = "<div>\n                 <h3>Your password was reset successfully </h3>\n             </div>";
                mailTo = user.emailId;
                // send mail for account activation
                mailService.sendMail(mailSubject, mailBody, mailTo);
                res.json({
                    message: "Password reset successfull check your mail for confirmation",
                    token: token,
                    data: {
                        email: user.emailId
                    }
                });
                return [3 /*break*/, 7];
            case 6:
                res.status(400).json({
                    message: "Failed to update password token invalid",
                });
                _b.label = 7;
            case 7: return [3 /*break*/, 9];
            case 8:
                err_6 = _b.sent();
                console.log(err_6);
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
