import { Schema, model } from 'mongoose';

export interface IUser {
    id: string;
    username: string;
    fullName: string;
    password: string;
}

const userSchema = new Schema<IUser>(
    {
        username: { type: String, required: true },
        fullName: { type: String, required: true },
        password: { type: String, required: true },
    },
    { timestamps: true }
);

const User = model<IUser>('User', userSchema);

export default User;
