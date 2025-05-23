import mongoose from 'mongoose';
import { MongoMemoryReplSet } from 'mongodb-memory-server';

let mongoServer: MongoMemoryReplSet;

export const connectTestDB = async () => {
    mongoServer = await MongoMemoryReplSet.create({
        replSet: { storageEngine: 'wiredTiger' }, // Sử dụng wiredTiger để hỗ trợ giao dịch
    });
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
};

export const disconnectTestDB = async () => {
    await mongoose.connection.dropDatabase();
    await mongoServer.stop(); // Dừng server trước
    await mongoose.connection.close(); // Rồi mới đóng kết nối mongoose
};
