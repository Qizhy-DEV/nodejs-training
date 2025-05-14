import Task, { ITask, TaskDto } from '../models/task';
import { generateSlug, getItemsPerPage } from '../utils/global';

interface PaginatedResponse<T> {
    data: T;
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
}

interface TaskResponse {
    tasks: TaskDto[];
    numberOfCompleted: number;
}

export type TaskFilter = 'all-tasks' | 'completed-tasks';

export class TaskService {
    async create(task: Partial<ITask>): Promise<ITask> {
        const slug = await generateSlug(task.title as string, Task);
        const newTask = new Task({ ...task, slug });
        return await newTask.save();
    }

    async update(id: string, updatedFields: Partial<ITask>): Promise<ITask | null> {
        return await Task.findByIdAndUpdate(id, updatedFields, { new: true });
    }

    async delete(id: string): Promise<ITask | null> {
        return await Task.findByIdAndDelete(id);
    }

    async getBySlug(slug: string): Promise<ITask | null> {
        return await Task.findOne({ slug }).lean();
    }

    async getByPage(
        currentPage: number,
        currentFilter: TaskFilter
    ): Promise<PaginatedResponse<TaskResponse>> {
        const pageSize = Number(process.env.PAGE_SIZE);

        const skip = (currentPage - 1) * pageSize;

        const total = await Task.countDocuments();

        const numberOfCompleted = await Task.countDocuments({ isComplete: true });

        const totalPages = getItemsPerPage(
            currentFilter === 'all-tasks' ? total : numberOfCompleted,
            pageSize
        );

        const tasks = await Task.find(currentFilter === 'all-tasks' ? {} : { isComplete: true })
            .skip(skip)
            .limit(pageSize)
            .lean();

        const transformedTasks = tasks.map(({ _id, ...rest }) => ({
            ...rest,
            id: _id.toString(),
        }));

        return {
            data: {
                tasks: transformedTasks,
                numberOfCompleted,
            },
            pagination: {
                page: currentPage > totalPages ? currentPage - 1 : currentPage,
                limit: pageSize,
                total,
                totalPages,
                hasNextPage: currentPage < totalPages,
                hasPreviousPage: currentPage > 1,
            },
        };
    }
}
