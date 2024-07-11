import jwt from 'jsonwebtoken';

const {
  JWT_SECRET,
  JWT_EXPIRES_IN,
  JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRES_IN,
} = process.env;

export const generateAccessToken = (payload: string | object) => {
  return jwt.sign(payload, JWT_SECRET || '', {
    expiresIn: parseInt(JWT_EXPIRES_IN || ''),
  });
};

export const verifyAccessToken = (token: string) => {
  try {
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET must be defined');
    }
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
};

export const generateRefreshToken = (payload: string | object) => {
  return jwt.sign(payload, JWT_REFRESH_SECRET || '', {
    expiresIn: parseInt(JWT_REFRESH_EXPIRES_IN || ''),
  });
};

export const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET || '');
  } catch (err) {
    return null;
  }
};
