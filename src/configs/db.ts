import mongoose from 'mongoose';
import Agenda from 'agenda';
import 'dotenv/config';

const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
    throw new Error('❌ Missing MONGODB_URI in .env file');
}

let agenda: Agenda;

const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(mongoURI);
        console.log('✅ MongoDB connected');

        agenda = new Agenda({
            db: {
                address: mongoURI,
                collection: 'agendaJobs',
            },
        });

        agenda.define('check database connection', async () => {
            const state = mongoose.connection.readyState;
            switch (state) {
                case 0:
                    console.log('🔴 MongoDB disconnected');
                    break;
                case 1:
                    console.log('🟢 MongoDB connected');
                    break;
                case 2:
                    console.log('🟡 MongoDB connecting...');
                    break;
                case 3:
                    console.log('🟠 MongoDB disconnecting...');
                    break;
                default:
                    console.log('❓ Unknown MongoDB state:', state);
            }
        });

        // Bắt đầu Agenda và lên lịch job mỗi phút
        await agenda.start();
        await agenda.every('1 minute', 'check database connection');

        console.log('🕒 Agenda job scheduled to check DB connection every minute');
    } catch (err) {
        console.error('❌ Error setting up DB and Agenda:', err);
        process.exit(1);
    }
};

export default connectDB;
