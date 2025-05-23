import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authenticate } from '../middlewares/auth';

const userController = new UserController();
const router = Router();

router.post('/', userController.create);

router.get('/get-by-token', authenticate, userController.getByToken);

export default router;
