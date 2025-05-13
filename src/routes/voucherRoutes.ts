import { Router } from 'express';
import { requestVoucherController } from '../controllers/voucherController';

const router = Router();

router.post('/:eventId', requestVoucherController);

export default router;
