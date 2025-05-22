import { Schema, model, Document } from 'mongoose';

interface IVoucher extends Document {
    code: string;
    eventId: Schema.Types.ObjectId;
    userId: Schema.Types.ObjectId;
}

const voucherSchema = new Schema<IVoucher>({
    code: { type: String, required: true },
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

const Voucher = model<IVoucher>('Voucher', voucherSchema);

export default Voucher;
