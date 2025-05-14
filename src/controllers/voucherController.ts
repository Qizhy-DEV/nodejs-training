import { Request, Response } from 'express';
import { VoucherService } from '../services/voucherService';

export class VoucherController {
    private voucherService: VoucherService;

    constructor() {
        this.voucherService = new VoucherService();
    }

    requestVoucherController = async (req: Request, res: Response) => {
        const { eventId } = req.params;

        try {
            const result = await this.voucherService.requestVoucher(eventId);
            res.status(200).json(result);
        } catch (error) {
            const err = error as Error;

            if (err.message === 'Voucher limit reached') {
                res.status(456).json({ message: 'Voucher limit reached' });
            } else {
                res.status(500).json({ message: err.message });
            }
        }
    };
}
