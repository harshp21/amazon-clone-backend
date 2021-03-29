import mongoose from 'mongoose';
import validator from 'validator'

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (value: string) => {
                return validator.isEmail(value);
            }
        }
    },
    address: String,
    password: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: false,
    },
    resetPasswordToken: String,
    resetPasswordTokenExpiry: Number,
    activateAccountToken: String,
    activateAccountTokenExpiry: Number,

});

// Creating an interface for User
interface IUser extends mongoose.Document {
    emailId: string;
    username: string;
    password: string;
    address: string;
    activateAccountToken: string;
    activateAccountTokenExpiry: number,
    isActive: boolean,
    resetPasswordToken: string,
    resetPasswordTokenExpiry: number
}

const User = mongoose.model<IUser>('User', userSchema);

export { User, IUser };