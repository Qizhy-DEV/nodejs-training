import { Router } from 'express';
import { VoucherController } from '../controllers/voucherController';

const voucherController = new VoucherController();
const router = Router();

router.post('/:eventId', voucherController.requestVoucherController);

export default router;
