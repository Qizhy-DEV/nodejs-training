import { Request, Response } from 'express';
import { VoucherService } from '../services/voucherService';
import { responseAPI } from '../utils/response';

export class VoucherController {
    private voucherService: VoucherService;

    constructor() {
        this.voucherService = new VoucherService();
    }

    requestVoucherController = async (req: Request, res: Response) => {
        try {
            const token = req.token as string;

            const eventId = req.body.eventId as string;

            const userId = req.body.userId as string;

            const result = await this.voucherService.requestVoucher(eventId, userId);

            res.status(200).json(
                responseAPI({
                    message: 'Getting voucher successfully',
                    data: result,
                    token,
                })
            );
        } catch (error) {
            const err = error as Error;
            if (err.message === 'Voucher limit reached') {
                res.status(456).json({ message: 'Voucher limit reached' });
            } else {
                res.status(500).json({ message: err.message });
            }
        }
    };

    getVouchersByUser = async (req: Request, res: Response) => {
        try {
            const userId = req.query.userId as string;
            const token = req.token as string;
            const result = await this.voucherService.getVouchersByUser(userId);
            res.status(200).json(
                responseAPI({
                    token,
                    data: result,
                })
            );
        } catch (error) {
            const err = error as Error;
            res.status(500).json({ message: err.message });
        }
    };
}
