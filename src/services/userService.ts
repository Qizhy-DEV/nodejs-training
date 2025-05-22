/* eslint-disable @typescript-eslint/no-unused-vars */
import User, { IUser } from '../models/user';
import { encryptPassword, verifyPassword } from '../utils/bcrypt';

export class UserService {
    create = async (user: Omit<IUser, 'id'>): Promise<Omit<IUser, 'password'>> => {
        const userFound = await User.findOne({ username: user.username });

        if (userFound) {
            throw new Error('Username already exists');
        }

        const passwordEncrypted = await encryptPassword(user.password);

        const newUser = await User.create({ ...user, password: passwordEncrypted });

        const { password: _, ...userWithoutPassword } = newUser.toObject() as IUser;

        return userWithoutPassword;
    };

    getByUserNameAndPassword = async (
        username: string,
        password: string
    ): Promise<Omit<IUser, 'password'>> => {
        const userFound = await User.findOne({ username }).lean();

        if (!userFound) {
            throw new Error('User not found');
        }

        const isMatch = await verifyPassword(password, userFound.password);
        if (!isMatch) {
            throw new Error('Incorrect password');
        }

        userFound.id = userFound._id.toString();
        const { password: _, ...userWithoutPassword } = userFound;

        return userWithoutPassword as Omit<IUser, 'password'>;
    };

    getById = async (id: string): Promise<Omit<IUser, 'password'>> => {
        const userFound = await User.findById(id).lean();

        if (!userFound) throw new Error('Not Found User');

        userFound.id = userFound?._id.toString();

        const { password: _, ...userWithoutPassword } = userFound;

        return userWithoutPassword;
    };
}
