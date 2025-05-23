import mongoose from 'mongoose';
import { connectTestDB, disconnectTestDB } from '../configs/setupTestDB';
import { UserService } from '../services/userService';
import { encryptPassword } from '../utils/bcrypt';
import { VoucherService } from '../services/voucherService';

const userService = new UserService();

const voucherService = new VoucherService();

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
        const userCreated = await userService.create({
            username: testUser.username,
            password: hashedPassword,
            fullName: testUser.fullName,
        });
        userId = userCreated.id;
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

    it('should return voucher by user', async () => {
        const vouchers = await voucherService.getVouchersByUser(userId);

        expect(Array.isArray(vouchers)).toBe(true);

        for (const voucher of vouchers) {
            expect(voucher).toHaveProperty('code');
            expect(voucher).toHaveProperty('eventId');
            expect(voucher).toHaveProperty('userId', userId);
        }
    });
});
