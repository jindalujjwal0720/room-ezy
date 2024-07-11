import express, { RequestHandler } from 'express';
const router = express.Router();

import { RequestWithUser, requireAdmin, requireAuth } from '../middlewares/auth';

import FloorController from '../controllers/floor';

router.get(
  '/',
  requireAuth as unknown as RequestHandler<RequestWithUser>,
  FloorController.getFloorsByBlock as unknown as RequestHandler<RequestWithUser>
);
router.get(
  '/:floorId',
  requireAuth as unknown as RequestHandler<RequestWithUser>,
  FloorController.getFloorById as unknown as RequestHandler<RequestWithUser>
);
router.post(
  '/multiple',
  requireAuth as unknown as RequestHandler<RequestWithUser>,
  requireAdmin as unknown as RequestHandler<RequestWithUser>,
  FloorController.createFloorsInBlock as unknown as RequestHandler<RequestWithUser>
);
router.patch(
  '/:floorId',
  requireAuth as unknown as RequestHandler<RequestWithUser>,
  requireAdmin as unknown as RequestHandler<RequestWithUser>,
  FloorController.updateFloor as unknown as RequestHandler<RequestWithUser>
);
router.delete(
  '/:floorId',
  requireAuth as unknown as RequestHandler<RequestWithUser>,
  requireAdmin as unknown as RequestHandler<RequestWithUser>,
  FloorController.deleteFloor as unknown as RequestHandler<RequestWithUser>
);

export default router;
