import express from 'express';
import voucherRoutes from './voucherRoutes';
import eventRoutes from './eventRoutes';
import userRoutes from './userRoutes';
import authRoutes from './authRoutes';

const router = express.Router();

router.use('/api/v1/vouchers', voucherRoutes);
router.use('/api/v1/events', eventRoutes);
router.use('/api/v1/users', userRoutes);
router.use('/api/v1/auths', authRoutes);

export default router;
