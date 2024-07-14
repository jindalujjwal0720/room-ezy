import rateLimit from 'express-rate-limit';

// OTP email rate limiter
// max 1 request per minute per IP
export const otpRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 1,
  message: 'Too many requests from this IP, please try again after a minute',
});