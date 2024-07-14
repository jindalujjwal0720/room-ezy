import { NextFunction, Response } from 'express';
import { RequestWithUser } from '../middlewares/auth';

// db
import { applicationDB } from '../config/db';

import ActionAuditLogCreator from '../models/ActionAuditLog';
const ActionAuditLog = ActionAuditLogCreator(applicationDB);

class LogsController {
  static async getActionAuditLogs(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const offset = Number(req.query.offset) || 0;
      const limit = Number(req.query.limit) || 10;

      const logs = await ActionAuditLog.find()
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .populate('triggeredBy', 'name')
        .populate('building', 'name');

      res.status(200).json({ logs });
    } catch (err) {
      next(err);
    }
  }

  static async clearActionAuditLogs(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      await ActionAuditLog.deleteMany({});

      await ActionAuditLog.create({
        action: 'CLEAR_ACTION_LOGS',
        triggeredBy: req.user.userId,
      });

      res.status(200).json({ message: 'Logs cleared successfully' });
    } catch (err) {
      next(err);
    }
  }
}

export default LogsController;
