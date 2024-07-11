import express, { RequestHandler } from 'express';
const router = express.Router();

import { RequestWithUser, requireAdmin, requireAuth } from '../middlewares/auth';

import BuildingController from '../controllers/building';

router.get(
  '/',
  requireAuth as unknown as RequestHandler<RequestWithUser>,
  BuildingController.getBuildings as unknown as RequestHandler<RequestWithUser>
);
router.get(
  '/:buildingId',
  requireAuth as unknown as RequestHandler<RequestWithUser>,
  BuildingController.getBuildingById as unknown as RequestHandler<RequestWithUser>
);
router.post(
  '/',
  requireAuth as unknown as RequestHandler<RequestWithUser>,
  requireAdmin as unknown as RequestHandler<RequestWithUser>,
  BuildingController.createBuilding as unknown as RequestHandler<RequestWithUser>
);
router.patch(
  '/:buildingId',
  requireAuth as unknown as RequestHandler<RequestWithUser>,
  requireAdmin as unknown as RequestHandler<RequestWithUser>,
  BuildingController.updateBuilding as unknown as RequestHandler<RequestWithUser>
);
router.delete(
  '/:buildingId',
  requireAuth as unknown as RequestHandler<RequestWithUser>,
  requireAdmin as unknown as RequestHandler<RequestWithUser>,
  BuildingController.deleteBuilding as unknown as RequestHandler<RequestWithUser>
);

export default router;
