import express from 'express';
import { TaskController } from '../controllers/taskController';

const router = express.Router();
const controller = new TaskController();

router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);
router.get('/', controller.getByPage);
router.get('/get-by-slug/:slug', controller.getBySlug);

export default router;
