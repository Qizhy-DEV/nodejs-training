import { Request, Response } from 'express';
import { requestVoucher } from '../services/voucherService';

export const requestVoucherController = async (req: Request, res: Response) => {
    const { eventId } = req.params;

    try {
        const result = await requestVoucher(eventId);
        res.status(200).json(result);
    } catch (error) {
        if (error.message === 'Voucher limit reached') {
            res.status(456).json({ message: 'Voucher limit reached' });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};
