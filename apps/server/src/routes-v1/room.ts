import express, { RequestHandler } from 'express';
const router = express.Router();

import { RequestWithUser, requireAuth } from '../middlewares/auth';

import RoomController from '../controllers/room';

router.get(
  '/',
  requireAuth as unknown as RequestHandler<RequestWithUser>,
  RoomController.getRoomsOnFloor as unknown as RequestHandler<RequestWithUser>
);
router.get(
  '/wanted',
  requireAuth as unknown as RequestHandler<RequestWithUser>,
  RoomController.getRoomsWantedByUser as unknown as RequestHandler<RequestWithUser>
);
router.get(
  '/probable',
  requireAuth as unknown as RequestHandler<RequestWithUser>,
  RoomController.getProbableRoomsForUser as unknown as RequestHandler<RequestWithUser>
);
router.get(
  '/allotment',
  requireAuth as unknown as RequestHandler<RequestWithUser>,
  RoomController.getAllotedRoomForUser as unknown as RequestHandler<RequestWithUser>
);
router.get(
  '/:roomId',
  requireAuth as unknown as RequestHandler<RequestWithUser>,
  RoomController.getRoomById as unknown as RequestHandler<RequestWithUser>
);
router.post(
  '/:roomId/wanted',
  requireAuth as unknown as RequestHandler<RequestWithUser>,
  RoomController.updateRoomWantedByUser as unknown as RequestHandler<RequestWithUser>
);

export default router;
