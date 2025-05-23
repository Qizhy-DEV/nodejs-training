import { Router } from 'express';
import { VoucherController } from '../controllers/voucherController';
import { authenticate } from '../middlewares/auth';

const voucherController = new VoucherController();
const router = Router();

router.post('/', authenticate, voucherController.requestVoucherController);

router.get('/get-by-user', authenticate, voucherController.getVouchersByUser);

export default router;
