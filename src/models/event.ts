import { Schema, model } from 'mongoose';

export interface IEvent {
    name: string;
    maxQuantity: number;
    voucherCount: number;
    image?: string;
    id: string;
    editing: {
        userId: Schema.Types.ObjectId | string | null;
        expire: number;
    };
}

const eventSchema = new Schema<IEvent>({
    name: { type: String, required: true },
    maxQuantity: { type: Number, required: true },
    voucherCount: { type: Number, default: 0 },
    editing: {
        expire: { type: Number, default: 0 },
        userId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    },
    image: {
        type: String,
        default:
            'https://www.shutterstock.com/image-vector/image-coming-soon-no-picture-600nw-2450891047.jpg',
    },
});

const Event = model<IEvent>('Event', eventSchema);

export default Event;
