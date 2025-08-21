import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import config from '@/config/config';
import { JwtPayload, RefreshTokenPayload } from '@/types/user.types';

/**
 * Hash a password using bcrypt
 */
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, config.security.bcryptSaltRounds);
};

/**
 * Compare a password with a hash
 */
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

/**
 * Generate JWT access token
 */
export const generateAccessToken = (payload: JwtPayload): string => {
  const { iat, exp, ...cleanPayload } = payload;
  return jwt.sign(cleanPayload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  } as SignOptions);
};

/**
 * Generate JWT refresh token
 */
export const generateRefreshToken = (payload: RefreshTokenPayload): string => {
  const { iat, exp, ...cleanPayload } = payload;
  return jwt.sign(cleanPayload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
  } as SignOptions);
};

/**
 * Verify JWT access token
 */
export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, config.jwt.secret) as JwtPayload;
};

/**
 * Verify JWT refresh token
 */
export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  return jwt.verify(token, config.jwt.refreshSecret) as RefreshTokenPayload;
};

/**
 * Extract token from Authorization header
 */
export const extractToken = (authHeader?: string): string | null => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
};
