import { Schema, model } from 'mongoose';

export interface IEditLock {
    id: string;
    eventId: Schema.Types.ObjectId;
    userId: Schema.Types.ObjectId | string;
    editable: boolean;
    expire: number;
}

const editLockSchema = new Schema<IEditLock>(
    {
        expire: { type: Number, default: 0 },
        editable: { type: Boolean, default: false },
        eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
        userId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    },
    { timestamps: true }
);

const EditLock = model<IEditLock>('EditLock', editLockSchema);

export default EditLock;
