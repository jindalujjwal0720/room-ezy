import express, { RequestHandler } from 'express';
const router = express.Router();

import { RequestWithUser, requireAdmin, requireAuth } from '../middlewares/auth';

import BlockController from '../controllers/building_block';

router.get(
  '/',
  requireAuth as unknown as RequestHandler<RequestWithUser>,
  BlockController.getBlocksByBuilding as unknown as RequestHandler<RequestWithUser>
);
router.get(
  '/:blockId',
  requireAuth as unknown as RequestHandler<RequestWithUser>,
  BlockController.getBlockById as unknown as RequestHandler<RequestWithUser>
);
router.post(
  '/multiple',
  requireAuth as unknown as RequestHandler<RequestWithUser>,
  requireAdmin as unknown as RequestHandler<RequestWithUser>,
  BlockController.createBlocksInBuilding as unknown as RequestHandler<RequestWithUser>
);
router.patch(
  '/:blockId',
  requireAuth as unknown as RequestHandler<RequestWithUser>,
  requireAdmin as unknown as RequestHandler<RequestWithUser>,
  BlockController.updateBlock as unknown as RequestHandler<RequestWithUser>
);
router.delete(
  '/:blockId',
  requireAuth as unknown as RequestHandler<RequestWithUser>,
  requireAdmin as unknown as RequestHandler<RequestWithUser>,
  BlockController.deleteBlock as unknown as RequestHandler<RequestWithUser>
);

export default router;
