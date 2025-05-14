import { Request, Response } from 'express';
import { TaskFilter, TaskService } from '../services/taskService';

export class TaskController {
    private taskService: TaskService;

    constructor() {
        this.taskService = new TaskService();
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.getByPage = this.getByPage.bind(this);
    }

    // POST /tasks
    create = async (req: Request, res: Response) => {
        try {
            const task = await this.taskService.create(req.body);
            res.status(201).json(task);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Failed to create task', error });
        }
    };

    // PUT /tasks/:id
    update = async (req: Request, res: Response) => {
        try {
            const updatedTask = await this.taskService.update(req.params.id, req.body);
            if (!updatedTask) {
                res.status(404).json({ message: 'Task not found' });
            }
            res.json(updatedTask);
        } catch (error) {
            res.status(500).json({ message: 'Failed to update task', error });
        }
    };

    // DELETE /tasks/:id
    delete = async (req: Request, res: Response) => {
        try {
            const deletedTask = await this.taskService.delete(req.params.id);
            if (!deletedTask) {
                res.status(404).json({ message: 'Task not found' });
            }
            res.json({ message: 'Task deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Failed to delete task', error });
        }
    };

    // GET /tasks/get-by-slug
    getBySlug = async (req: Request, res: Response) => {
        try {
            const task = await this.taskService.getBySlug(req.params.slug);
            res.json(task);
        } catch (error) {
            res.status(500).json({ message: 'Failed to fetch task', error });
        }
    };

    // GET /tasks
    getByPage = async (req: Request, res: Response) => {
        try {
            const page = Number(req.query.page) || 1;
            const rawFilter = req.query.filter;

            const validFilters: TaskFilter[] = ['all-tasks', 'completed-tasks'];

            let filter: TaskFilter = 'all-tasks';

            if (typeof rawFilter === 'string' && validFilters.includes(rawFilter as TaskFilter)) {
                filter = rawFilter as TaskFilter;
            }

            const paginatedTasks = await this.taskService.getByPage(page, filter);

            res.json(paginatedTasks);
        } catch (error) {
            res.status(500).json({ message: 'Failed to fetch tasks', error });
        }
    };
}
