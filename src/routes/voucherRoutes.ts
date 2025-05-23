import { Router } from 'express';
import { VoucherController } from '../controllers/voucherController';
import { authenticate } from '../middlewares/auth';

const voucherController = new VoucherController();
const router = Router();

/**
 * @swagger
 * /api/v1/vouchers:
 *   post:
 *     summary: Request a voucher
 *     tags:
 *       - Vouchers
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - eventId
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "682ffa215792e2bcb84b0229"
 *               eventId:
 *                 type: string
 *                 example: "682ffb652d622662cc2ae79d"
 *     responses:
 *       200:
 *         description: Getting voucher successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Getting voucher successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                       example: "VOUCHER-DRDAYR3I6"
 *                     eventId:
 *                       type: string
 *                       example: "682ffb652d622662cc2ae79d"
 *                     userId:
 *                       type: string
 *                       example: "682ffa215792e2bcb84b0229"
 *                     _id:
 *                       type: string
 *                       example: "682ffc46a0bbe1ec5d3c2fd0"
 *                     __v:
 *                       type: integer
 *                       example: 0
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post('/', authenticate, voucherController.requestVoucherController);

/**
 * @swagger
 * /api/v1/vouchers/get-by-user/{userId}:
 *   get:
 *     summary: Get vouchers by user ID
 *     tags:
 *       - Vouchers
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         description: ID of the user to fetch vouchers for
 *         required: true
 *         schema:
 *           type: string
 *           example: "682ffa215792e2bcb84b0229"
 *     responses:
 *       200:
 *         description: List of vouchers for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "682ffc46a0bbe1ec5d3c2fd0"
 *                       code:
 *                         type: string
 *                         example: "VOUCHER-DRDAYR3I6"
 *                       eventId:
 *                         type: string
 *                         example: "682ffb652d622662cc2ae79d"
 *                       userId:
 *                         type: string
 *                         example: "682ffa215792e2bcb84b0229"
 *                       __v:
 *                         type: integer
 *                         example: 0
 *       401:
 *         description: Unauthorized — invalid or missing authentication token
 *       404:
 *         description: No vouchers found for the given user
 */

router.get('/get-by-user/:userId', authenticate, voucherController.getVouchersByUser);

export default router;
