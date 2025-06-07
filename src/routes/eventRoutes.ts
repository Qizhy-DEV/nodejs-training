import { Router } from 'express';
import { EventController } from '../controllers/eventController';
import { uploadMiddleware } from '../helper/upload/upload';
import { authenticate } from '../middlewares/auth';

const eventController = new EventController();

const router = Router();

/**
 * @swagger
 * /api/v1/events:
 *   post:
 *     summary: Create a new event
 *     tags:
 *       - Events
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - image
 *               - maxQuantity
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Nocturne Live"
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Event image file
 *               maxQuantity:
 *                 type: integer
 *                 example: 10
 *     responses:
 *       201:
 *         description: Event created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Create event successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "Nocturne Live"
 *                     maxQuantity:
 *                       type: integer
 *                       example: 10
 *                     voucherCount:
 *                       type: integer
 *                       example: 0
 *                     editing:
 *                       type: object
 *                       properties:
 *                         expire:
 *                           type: integer
 *                           example: 0
 *                         userId:
 *                           type: string
 *                           nullable: true
 *                           example: null
 *                     image:
 *                       type: string
 *                       format: uri
 *                       example: "https://res.cloudinary.com/dkopgdffv/image/upload/v1747975013/uploads/image_1747975010298_0.8483913791636933.png"
 *                     __v:
 *                       type: integer
 *                       example: 0
 *                     id:
 *                       type: string
 *                       example: "682ffb652d622662cc2ae79d"
 *       400:
 *         description: Missing or invalid input data
 */

router.post('/', uploadMiddleware, eventController.create);

/**
 * @swagger
 * /api/v1/events/get-edit-lock:
 *   get:
 *     summary: Get the event currently locked for editing by the authenticated user
 *     tags:
 *       - Events
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Editing lock information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "Nocturne Live"
 *                     maxQuantity:
 *                       type: integer
 *                       example: 10
 *                     voucherCount:
 *                       type: integer
 *                       example: 2
 *                     editing:
 *                       type: object
 *                       properties:
 *                         expire:
 *                           type: integer
 *                           example: 1747980919929
 *                         userId:
 *                           type: string
 *                           example: "682ffa215792e2bcb84b0229"
 *                     image:
 *                       type: string
 *                       format: uri
 *                       example: "https://res.cloudinary.com/dkopgdffv/image/upload/v1747975013/uploads/image_1747975010298_0.8483913791636933.png"
 *                     __v:
 *                       type: integer
 *                       example: 0
 *                     id:
 *                       type: string
 *                       example: "682ffb652d622662cc2ae79d"
 *       401:
 *         description: Unauthorized - invalid or missing access token
 *       404:
 *         description: No event is currently locked for editing by the user
 */

router.get('/get-edit-lock', authenticate, eventController.getByUser);

/**
 * @swagger
 * /api/v1/events/{id}:
 *   get:
 *     summary: Get event details by ID
 *     tags:
 *       - Events
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Event ID to retrieve
 *         required: true
 *         schema:
 *           type: string
 *           example: "682ffb652d622662cc2ae79d"
 *     responses:
 *       200:
 *         description: Event details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     editing:
 *                       type: object
 *                       properties:
 *                         expire:
 *                           type: integer
 *                           example: 1747980919929
 *                         userId:
 *                           type: string
 *                           example: "682ffa215792e2bcb84b0229"
 *                     name:
 *                       type: string
 *                       example: "Nocturne Live"
 *                     maxQuantity:
 *                       type: integer
 *                       example: 10
 *                     voucherCount:
 *                       type: integer
 *                       example: 2
 *                     image:
 *                       type: string
 *                       format: uri
 *                       example: "https://res.cloudinary.com/dkopgdffv/image/upload/v1747975013/uploads/image_1747975010298_0.8483913791636933.png"
 *                     __v:
 *                       type: integer
 *                       example: 0
 *                     id:
 *                       type: string
 *                       example: "682ffb652d622662cc2ae79d"
 *       404:
 *         description: Event not found
 */

router.get('/:id', eventController.getEventById);

/**
 * @swagger
 * /api/v1/events:
 *   get:
 *     summary: Get paginated list of all events
 *     tags:
 *       - Events
 *     parameters:
 *       - name: page
 *         in: query
 *         description: Page number (default 1)
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: limit
 *         in: query
 *         description: Number of events per page (default 10)
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: List of events with pagination info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         limit:
 *                           type: integer
 *                           example: 10
 *                         page:
 *                           type: integer
 *                           example: 1
 *                         total:
 *                           type: integer
 *                           example: 2
 *                         totalPage:
 *                           type: integer
 *                           example: 1
 *                         hasNext:
 *                           type: boolean
 *                           example: false
 *                         hasPrev:
 *                           type: boolean
 *                           example: false
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: "Nocturne Live"
 *                           maxQuantity:
 *                             type: integer
 *                             example: 10
 *                           voucherCount:
 *                             type: integer
 *                             example: 2
 *                           editing:
 *                             type: object
 *                             properties:
 *                               expire:
 *                                 type: integer
 *                                 example: 1747980919929
 *                               userId:
 *                                 type: string
 *                                 example: "682ffa215792e2bcb84b0229"
 *                           image:
 *                             type: string
 *                             format: uri
 *                             example: "https://res.cloudinary.com/dkopgdffv/image/upload/v1747975013/uploads/image_1747975010298_0.8483913791636933.png"
 *                           __v:
 *                             type: integer
 *                             example: 0
 *                           id:
 *                             type: string
 *                             example: "682ffb652d622662cc2ae79d"
 */

router.get('/', eventController.getEvents);

/**
 * @swagger
 * /api/v1/events/{eventId}/editable/me:
 *   post:
 *     summary: Request edit lock on an event for the authenticated user
 *     tags:
 *       - Events
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the event to request edit lock for
 *         example: "682ffb652d622662cc2ae79d"
 *     responses:
 *       200:
 *         description: Request edit event successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Request edit event successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     editing:
 *                       type: object
 *                       properties:
 *                         expire:
 *                           type: integer
 *                           example: 1747980919929
 *                         userId:
 *                           type: string
 *                           example: "682ffa215792e2bcb84b0229"
 *                     name:
 *                       type: string
 *                       example: "Nocturne Live"
 *                     maxQuantity:
 *                       type: integer
 *                       example: 10
 *                     voucherCount:
 *                       type: integer
 *                       example: 2
 *                     image:
 *                       type: string
 *                       format: uri
 *                       example: "https://res.cloudinary.com/dkopgdffv/image/upload/v1747975013/uploads/image_1747975010298_0.8483913791636933.png"
 *                     __v:
 *                       type: integer
 *                       example: 0
 *                     id:
 *                       type: string
 *                       example: "682ffb652d622662cc2ae79d"
 *       400:
 *         description: Invalid eventId or request
 *       401:
 *         description: Unauthorized - missing or invalid access token
 *       404:
 *         description: Event not found or no permission to edit
 */

router.post('/:eventId/editable/me', authenticate, eventController.requestEdit);

/**
 * @swagger
 * /api/v1/events/{eventId}/editable/release:
 *   post:
 *     summary: Release edit lock for an event
 *     tags:
 *       - Events
 *     parameters:
 *       - name: eventId
 *         in: path
 *         description: ID of the event to release edit lock from
 *         required: true
 *         schema:
 *           type: string
 *           example: "682ffb652d622662cc2ae79d"
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Edit lock released successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Release edit event successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     editing:
 *                       type: object
 *                       properties:
 *                         expire:
 *                           type: integer
 *                           example: 0
 *                         userId:
 *                           type: string
 *                           nullable: true
 *                           example: null
 *                     name:
 *                       type: string
 *                       example: "Nocturne Live"
 *                     maxQuantity:
 *                       type: integer
 *                       example: 10
 *                     voucherCount:
 *                       type: integer
 *                       example: 2
 *                     image:
 *                       type: string
 *                       format: uri
 *                       example: "https://res.cloudinary.com/dkopgdffv/image/upload/v1747975013/uploads/image_1747975010298_0.8483913791636933.png"
 *                     __v:
 *                       type: integer
 *                       example: 0
 *                     id:
 *                       type: string
 *                       example: "682ffb652d622662cc2ae79d"
 *       400:
 *         description: Invalid event ID or user not authorized
 *       401:
 *         description: Unauthorized or missing access token
 */

router.post('/:eventId/editable/release', authenticate, eventController.releaseEdit);

/**
 * @swagger
 * /api/v1/events/{eventId}/editable/maintain:
 *   post:
 *     summary: Maintain (refresh) the edit lock on an event
 *     tags:
 *       - Events
 *     parameters:
 *       - name: eventId
 *         in: path
 *         description: ID of the event to maintain edit lock on
 *         required: true
 *         schema:
 *           type: string
 *           example: "682ffb652d622662cc2ae79d"
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Edit lock maintained successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Maintain edit event successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     editing:
 *                       type: object
 *                       properties:
 *                         expire:
 *                           type: integer
 *                           example: 1747981643357
 *                         userId:
 *                           type: string
 *                           example: "682ffa215792e2bcb84b0229"
 *                     name:
 *                       type: string
 *                       example: "Nocturne Live"
 *                     maxQuantity:
 *                       type: integer
 *                       example: 10
 *                     voucherCount:
 *                       type: integer
 *                       example: 2
 *                     image:
 *                       type: string
 *                       format: uri
 *                       example: "https://res.cloudinary.com/dkopgdffv/image/upload/v1747975013/uploads/image_1747975010298_0.8483913791636933.png"
 *                     __v:
 *                       type: integer
 *                       example: 0
 *                     id:
 *                       type: string
 *                       example: "682ffb652d622662cc2ae79d"
 *       400:
 *         description: Invalid event ID or unauthorized user
 *       401:
 *         description: Unauthorized or missing access token
 */

router.post('/:eventId/editable/maintain', authenticate, eventController.maintainEdit);

export default router;
