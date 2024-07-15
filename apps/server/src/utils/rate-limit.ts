import rateLimit from 'express-rate-limit';

// OTP email rate limiter
// max 1 request per minute per email
export const otpRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 1,
  keyGenerator: (req) => req.body.email,
  message: { message: 'Too many requests, please try again later.' },
});
