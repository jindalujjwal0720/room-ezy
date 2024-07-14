import express, { RequestHandler } from 'express';
const router = express.Router();

import {
  RequestWithUser,
  requireAuth,
  requireAdmin,
} from '../middlewares/auth';
import LogsController from '../controllers/logs';

router.get(
  '/actions',
  requireAuth as unknown as RequestHandler<RequestWithUser>,
  requireAdmin as unknown as RequestHandler<RequestWithUser>,
  LogsController.getActionAuditLogs as unknown as RequestHandler<RequestWithUser>
);
router.post(
  '/actions/clear',
  requireAuth as unknown as RequestHandler<RequestWithUser>,
  requireAdmin as unknown as RequestHandler<RequestWithUser>,
  LogsController.clearActionAuditLogs as unknown as RequestHandler<RequestWithUser>
);

export default router;
