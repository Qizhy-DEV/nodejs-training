import mongoose from 'mongoose';
import Event from '../models/event';
import Voucher from '../models/voucher';

const generateVoucherCode = () => {
    return `VOUCHER-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

export class VoucherService {
    requestVoucher = async (eventId: string) => {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // Tìm event
            const event = await Event.findById(eventId).session(session);
            if (!event) throw new Error('Event not found');

            // Kiểm tra nếu số lượng voucher còn lại > 0
            if (event.voucherCount >= event.maxQuantity) {
                throw new Error('Voucher limit reached');
            }

            // Tạo voucher mới
            const voucherCode = generateVoucherCode();
            const voucher = new Voucher({
                code: voucherCode,
                eventId: eventId,
            });

            // Lưu voucher và cập nhật số lượng voucher trong event
            await voucher.save({ session });
            event.voucherCount += 1;
            await event.save({ session });

            await session.commitTransaction();
            session.endSession();

            return { code: voucherCode };
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    };
}
