import { NextFunction, Request, Response } from 'express';

// db
import { applicationDB } from '../config/db';

// models
import UserCreator from '../models/User';
const User = UserCreator(applicationDB);

// services
import Mailer from '../services/mailer';

// utils
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/token';
import { BadRequestError } from '../utils/errors';
import { generateOTP } from '../utils/otp';

// packages
import validator from 'validator';

// middlewares
import { RequestWithUser } from '../middlewares/auth';

class AuthController {
  static async sendLoginOTP(req: Request, res: Response, next: NextFunction) {
    try {
      let { email } = req.body;

      // converting to strings for safe query
      email = email?.toString()?.toLowerCase();

      // validations
      if (!email || !validator.isEmail(email)) {
        throw new BadRequestError('Invalid email');
      }

      const WHITELISTED_DOMAINS =
        process.env.WHITELISTED_EMAIL_DOMAINS?.split(',') || [];
      const domain = email.split('@')[1];
      if (!WHITELISTED_DOMAINS.includes(domain)) {
        throw new BadRequestError(
          'Invalid email domain. Please use your college email'
        );
      }

      let user = await User.findOne({ email });
      if (!user) {
        user = new User({ email });
      }

      const otp = generateOTP(6);
      const otpExpireSeconds = Number(
        process.env.LOGIN_OTP_EXPIRY_DURATION || 0
      );
      const otpExpires = new Date(Date.now() + otpExpireSeconds * 1000);

      user.otp = otp;
      user.otpExpires = otpExpires;
      await user.save();

      await Mailer.sendLoginOTP({ email, otp });

      res.status(200).json({ message: 'OTP sent successfully' });
    } catch (err) {
      next(err);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      let { email, otp } = req.body;

      // converting to strings for safe query
      email = email?.toString()?.toLowerCase();
      otp = otp?.toString();

      // validations
      if (!email || !validator.isEmail(email)) {
        throw new BadRequestError('Invalid email');
      }

      const user = await User.findOne({ email });
      if (!user) throw new BadRequestError('User not found');

      if (!user.otp || !user.otpExpires) {
        throw new BadRequestError('OTP not generated');
      }

      if (user.otp !== otp) {
        throw new BadRequestError('Invalid OTP');
      }

      if (user.otpExpires < new Date()) {
        throw new BadRequestError('OTP expired. Please generate a new one');
      }

      user.otp = undefined;
      user.otpExpires = undefined;
      await user.save();

      const payload = { userId: user._id, role: user.role };
      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);

      res
        .status(200)
        .cookie('room-ezy-refresh-token', refreshToken, {
          httpOnly: true,
          sameSite: 'none',
          secure: true,
          maxAge: parseInt(process.env.JWT_REFRESH_EXPIRES_IN as string) * 1000,
        })
        .json({ accessToken, user, message: 'Login successful' });
    } catch (err) {
      next(err);
    }
  }

  static async updateUser(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user.userId;
      if (!userId) throw new BadRequestError('Invalid user');

      const user = await User.findById(userId);
      if (!user) throw new BadRequestError('User not found');

      let { name, admissionNumber } = req.body;

      // converting to strings for safe query
      name = name?.toString();
      admissionNumber = admissionNumber?.toString();

      user.name = name || user.name;
      user.admissionNumber = admissionNumber || user.admissionNumber;

      await user.save();
      res.status(200).json({ user, message: 'User updated successfully' });
    } catch (err) {
      next(err);
    }
  }

  static async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies?.['room-ezy-refresh-token']?.toString();
      const payload = verifyRefreshToken(refreshToken) as { userId: string };

      if (!payload) {
        throw new BadRequestError('Invalid refresh token');
      }

      const user = await User.findById(payload.userId);

      if (!user) {
        throw new BadRequestError('Invalid user');
      }

      const newPayload = { userId: user._id, role: user.role };
      const accessToken = generateAccessToken(newPayload);

      res.status(200).json({ accessToken, user });
    } catch (err) {
      next(err);
    }
  }

  static async me(req: RequestWithUser, res: Response, next: NextFunction) {
    try {
      const userId = req.user.userId;
      if (!userId) throw new BadRequestError('Invalid user');

      const user = await User.findById(req.user.userId);
      if (!user) throw new BadRequestError('User not found');

      res.status(200).json({ user });
    } catch (err) {
      next(err);
    }
  }

  static async logout(_: Request, res: Response, next: NextFunction) {
    try {
      res
        .status(200)
        .clearCookie('room-ezy-refresh-token')
        .json({ message: 'Logout successful' });
    } catch (err) {
      next(err);
    }
  }
}

export default AuthController;
