import mongoose from 'mongoose';
import { connectTestDB, disconnectTestDB } from '../configs/setupTestDB';
import { AuthService } from '../services/authService';
import { encryptPassword } from '../utils/bcrypt';
import User from '../models/user';

const authService = new AuthService();

describe('Authentacation Service Test', () => {
    const user_id = '682d5462a5f78e911686d8f9';

    const testUser = {
        username: '20089731',
        password: 'ducvu0969',
        fullName: 'Vu Tien Duc',
    };

    beforeAll(async () => {
        await connectTestDB();
    });

    beforeEach(async () => {
        const hashedPassword = await encryptPassword(testUser.password);
        await User.create({
            username: testUser.username,
            password: hashedPassword,
            fullName: testUser.fullName,
        });
    });

    afterEach(async () => {
        const collections = mongoose.connection.collections;
        for (const key in collections) {
            await collections[key].deleteMany({});
        }
    });

    afterAll(async () => {
        await disconnectTestDB();
    });

    it('should return AccessToken and RefreshToken', async () => {
        const tokens = await AuthService.generateTokens({ user_id: user_id });
        expect(tokens).toHaveProperty('accessToken');
        expect(tokens).toHaveProperty('refreshToken');
    });

    it('should login successfully', async () => {
        const auth = await authService.login(testUser.username, testUser.password);
        expect(auth.data).toHaveProperty('username', testUser.username);
        expect(auth.data).not.toHaveProperty('password');
        expect(auth.data).toHaveProperty('fullName', testUser.fullName);
        expect(auth.data).toHaveProperty('id');
        expect(auth.tokens).toHaveProperty('accessToken');
        expect(auth.tokens).toHaveProperty('refreshToken');
    });
});
