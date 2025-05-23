import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authenticate } from '../middlewares/auth';

const userController = new UserController();
const router = Router();

/**
 * @swagger
 * /api/v1/users:
 *   post:
 *     summary: Create a new user
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - fullName
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: "vutienduc2612"
 *               fullName:
 *                 type: string
 *                 example: "Vu Tien Duc"
 *               password:
 *                 type: string
 *                 example: "ducvu0969"
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Create user successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                       example: "vutienduc2613"
 *                     fullName:
 *                       type: string
 *                       example: "Vu Tien Duc"
 *                     _id:
 *                       type: string
 *                       example: "68300e2ff868ccd060f8f18f"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-05-23T05:57:03.773Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-05-23T05:57:03.773Z"
 *                     __v:
 *                       type: integer
 *                       example: 0
 *       400:
 *         description: Missing or invalid user data
 */

router.post('/', userController.create);

/**
 * @swagger
 * /api/v1/users/get-by-token:
 *   get:
 *     summary: Get user info from access token
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "682ffa215792e2bcb84b0229"
 *                     username:
 *                       type: string
 *                       example: "vutienduc2612"
 *                     fullName:
 *                       type: string
 *                       example: "Vu Tien Duc"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-05-23T04:31:29.634Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-05-23T04:31:29.634Z"
 *                     __v:
 *                       type: integer
 *                       example: 0
 *                     id:
 *                       type: string
 *                       example: "682ffa215792e2bcb84b0229"
 *       401:
 *         description: Unauthorized — invalid or missing access token
 *       404:
 *         description: User not found
 */

router.get('/get-by-token', authenticate, userController.getByToken);

export default router;
