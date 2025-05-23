import mongoose from 'mongoose';
import Event from '../models/event';
import Voucher from '../models/voucher';

const generateVoucherCode = () => {
    return `VOUCHER-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

export class VoucherService {
    requestVoucher = async (eventId: string, userId: string) => {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const event = await Event.findById(eventId).session(session);
            if (!event) throw new Error('Event not found');

            if (event.voucherCount >= event.maxQuantity) {
                throw new Error('Voucher limit reached');
            }

            const voucherCode = generateVoucherCode();
            const voucher = new Voucher({
                code: voucherCode,
                eventId: eventId,
                userId: userId,
            });

            const voucherCreated = await voucher.save({ session });
            event.voucherCount += 1;
            await event.save({ session });

            await session.commitTransaction();
            session.endSession();

            return voucherCreated;
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    };

    getVouchersByUser = async (userId: string) => {
        const vouchers = await Voucher.find({ userId }).lean();

        return vouchers;
    };
}
