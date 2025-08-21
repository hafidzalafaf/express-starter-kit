import { Request, Response, NextFunction } from 'express';
import { AuthService } from '@/services/auth.service';
import { CreateUserRequest, LoginRequest } from '@/types/user.types';
import { AuthenticatedRequest } from '@/types/common.types';
import { createSuccessResponse, createErrorResponse } from '@/utils/response';

export class AuthController {
  /**
   * Register a new user
   */
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userData: CreateUserRequest = req.body;
      const user = await AuthService.register(userData);

      res.status(201).json(createSuccessResponse(user, 'User registered successfully'));
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json(createErrorResponse(error.message));
        return;
      }
      next(error);
    }
  }

  /**
   * Login user
   */
  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const loginData: LoginRequest = req.body;
      const authResponse = await AuthService.login(loginData);

      res.status(200).json(createSuccessResponse(authResponse, 'Login successful'));
    } catch (error) {
      if (error instanceof Error) {
        res.status(401).json(createErrorResponse(error.message));
        return;
      }
      next(error);
    }
  }

  /**
   * Refresh access token
   */
  static async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;
      const tokens = await AuthService.refreshToken(refreshToken);

      res.status(200).json(createSuccessResponse(tokens, 'Token refreshed successfully'));
    } catch (error) {
      if (error instanceof Error) {
        res.status(401).json(createErrorResponse(error.message));
        return;
      }
      next(error);
    }
  }

  /**
   * Logout user
   */
  static async logout(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('Authentication required'));
        return;
      }

      await AuthService.logout(req.user.userId);

      res.status(200).json(createSuccessResponse(null, 'Logout successful'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get current user profile
   */
  static async getProfile(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('Authentication required'));
        return;
      }

      const user = await AuthService.getProfile(req.user.userId);

      res.status(200).json(createSuccessResponse(user, 'Profile retrieved successfully'));
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json(createErrorResponse(error.message));
        return;
      }
      next(error);
    }
  }
}
