import { Schema, model, Document } from 'mongoose';

export interface IEvent extends Document {
    name: string;
    maxQuantity: number;
    voucherCount: number;
    image: string;
}

const eventSchema = new Schema<IEvent>({
    name: { type: String, required: true },
    maxQuantity: { type: Number, required: true },
    voucherCount: { type: Number, default: 0 },
    image: { type: String, required: true },
});

const Event = model<IEvent>('Event', eventSchema);

export default Event;
