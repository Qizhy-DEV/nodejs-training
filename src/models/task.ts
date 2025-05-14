import { Schema, model, Document } from 'mongoose';

export interface ITask extends Document {
    title: string;
    subtitle: string;
    isComplete?: boolean;
    slug: string;
}

export interface TaskDto {
    id: string;
    title: string;
    subtitle: string;
    isComplete?: boolean;
    slug: string;
}

const TaskSchema = new Schema<ITask>(
    {
        title: { type: String, required: true },
        subtitle: { type: String, required: true },
        isComplete: { type: Boolean, default: false },
        slug: { type: String, required: true },
    },
    { timestamps: true }
);

const Task = model<ITask>('Task', TaskSchema);

export default Task;
