import { Schema, model, Document } from 'mongoose';

interface IEvent extends Document {
    name: string;
    maxQuantity: number;
    voucherCount: number;
}

const eventSchema = new Schema<IEvent>({
    name: { type: String, required: true },
    maxQuantity: { type: Number, required: true },
    voucherCount: { type: Number, default: 0 },
});

const Event = model<IEvent>('Event', eventSchema);

export default Event;
