import mongoose from 'mongoose';
import { connectTestDB, disconnectTestDB } from '../configs/setupTestDB';
import User, { IUser } from '../models/user';
import { UserService } from '../services/userService';
import { encryptPassword } from '../utils/bcrypt';

const userService = new UserService();

describe('User Model Test', () => {
    const testUser = {
        username: '20089731',
        password: 'ducvu0969',
        fullName: 'Vu Tien Duc',
    };

    let userId = '';

    beforeAll(async () => {
        await connectTestDB();
    });

    beforeEach(async () => {
        const hashedPassword = await encryptPassword(testUser.password);
        const userCreated = await User.create({
            username: testUser.username,
            password: hashedPassword,
            fullName: testUser.fullName,
        });
        userId = userCreated._id.toString();
    });

    afterEach(async () => {
        // Clear DB after each test
        const collections = mongoose.connection.collections;
        for (const key in collections) {
            await collections[key].deleteMany({});
        }
    });

    afterAll(async () => {
        await disconnectTestDB();
    });

    it('should create & save a user successfully', async () => {
        const userData: Omit<IUser, 'id'> = {
            username: 'vutienduc2612',
            fullName: 'Vu Tien Duc',
            password: 'ducvu0969',
        };
        const user = new User(userData);
        const savedUser = await user.save();

        expect(savedUser._id).toBeDefined();
        expect(savedUser.username).toBe(userData.username);
        expect(savedUser.fullName).toBe(userData.fullName);
        expect(savedUser.password).not.toHaveProperty('password');
        expect(savedUser.password).toBeDefined();
    });

    it('should return user without password (getByUserNameAndPassword)', async () => {
        const username = testUser.username;
        const password = testUser.password;
        const fullName = testUser.fullName;

        const userFound = await userService.getByUserNameAndPassword(username, password);

        expect(userFound).toHaveProperty('username', username);
        expect(userFound).not.toHaveProperty('password');
        expect(userFound).toHaveProperty('fullName', fullName);
    });

    it('should return user without password (getById)', async () => {
        const id = userId;
        const username = testUser.username;
        const fullName = testUser.fullName;

        const userFound = await userService.getById(id);

        expect(userFound).toHaveProperty('username', username);
        expect(userFound).not.toHaveProperty('password');
        expect(userFound).toHaveProperty('fullName', fullName);
    });
});
