import express, { RequestHandler } from 'express';
const router = express.Router();

import AuthController from '../controllers/auth';
import { RequestWithUser, requireAuth } from '../middlewares/auth';

router.post('/send-login-otp', AuthController.sendLoginOTP);
router.post('/login', AuthController.login);
router.patch(
  '/update-user',
  requireAuth as unknown as RequestHandler<RequestWithUser>,
  AuthController.updateUser as unknown as RequestHandler<RequestWithUser>
);
router.get('/refresh', AuthController.refreshToken);
router.get(
  '/me',
  requireAuth as unknown as RequestHandler<RequestWithUser>,
  AuthController.me as unknown as RequestHandler<RequestWithUser>
);
router.get(
  '/logout',
  requireAuth as unknown as RequestHandler<RequestWithUser>,
  AuthController.logout as unknown as RequestHandler<RequestWithUser>
);

export default router;
