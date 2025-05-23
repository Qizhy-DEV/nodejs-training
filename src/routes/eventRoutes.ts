import { Router } from 'express';
import { EventController } from '../controllers/eventController';
import { uploadMiddleware } from '../helper/upload/upload';
import { EditLockController } from '../controllers/editLockController';
import { authenticate } from '../middlewares/auth';

const eventController = new EventController();

const editLockController = new EditLockController();

const router = Router();

router.post('/', uploadMiddleware, eventController.create);

router.get('/:id', eventController.getEventById);

router.get('/', eventController.getEvents);

router.post('/:eventId/editable/me', authenticate, editLockController.requestEdit);

router.post('/:eventId/editable/release', authenticate, editLockController.releaseEdit);

router.post('/:eventId/editable/maintain', authenticate, editLockController.maintainEdit);

export default router;
