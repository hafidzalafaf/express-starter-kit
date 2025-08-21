import { UserModel } from '@/models/user.model';
import { CreateUserRequest, LoginRequest, AuthResponse, UserResponse } from '@/types/user.types';
import {
  hashPassword,
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
} from '@/utils/auth';
import logger from '@/utils/logger';

export class AuthService {
  /**
   * Register a new user
   */
  static async register(userData: CreateUserRequest): Promise<UserResponse> {
    // Check if user already exists
    const existingUserByEmail = await UserModel.findByEmail(userData.email);
    if (existingUserByEmail) {
      throw new Error('User with this email already exists');
    }

    const existingUserByUsername = await UserModel.findByUsername(userData.username);
    if (existingUserByUsername) {
      throw new Error('User with this username already exists');
    }

    // Hash password
    const hashedPassword = await hashPassword(userData.password);

    // Create user
    const user = await UserModel.create({
      ...userData,
      password: hashedPassword,
    });

    logger.info(`User registered successfully: ${user.email}`);
    return user;
  }

  /**
   * Login user
   */
  static async login(loginData: LoginRequest): Promise<AuthResponse> {
    // Find user by email
    const user = await UserModel.findByEmail(loginData.email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Compare password
    const isPasswordValid = await comparePassword(loginData.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      tokenVersion: 1, // You can implement token versioning for better security
    });

    // Save refresh token
    await UserModel.updateRefreshToken(user.id, refreshToken);

    const userResponse: UserResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    logger.info(`User logged in successfully: ${user.email}`);

    return {
      user: userResponse,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Refresh access token
   */
  static async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    // Find user by refresh token
    const user = await UserModel.findByRefreshToken(refreshToken);
    if (!user) {
      throw new Error('Invalid refresh token');
    }

    // Generate new access token
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return { accessToken };
  }

  /**
   * Logout user
   */
  static async logout(userId: number): Promise<void> {
    await UserModel.updateRefreshToken(userId, null);
    logger.info(`User logged out successfully: ${userId}`);
  }

  /**
   * Get user profile
   */
  static async getProfile(userId: number): Promise<UserResponse> {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  /**
   * Update user password
   */
  static async updatePassword(
    userId: number,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await UserModel.findByEmail(''); // We need to get user by ID with password
    // For now, let's create a method to get user with password by ID

    throw new Error('Method not implemented yet');
  }
}
