/**
 * SynKrew — Auth Service Boundary
 * Path: services/auth.ts
 *
 * Implements mock backend methods with realistic network latency and typed contracts.
 */

import {
  AuthUser,
  LoginRequest,
  SignupRequest,
  VerifyOtpRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  AuthResponse,
} from '../types/api';
import { simulateNetworkDelay } from '../lib/api-client';
import { AuthStorage } from '../lib/auth-storage';

const MOCK_USER: AuthUser = {
  id: 'user_master_99',
  email: 'pilot@synkrew.dev',
  username: 'KrewMaster99',
  avatarUrl: undefined,
  createdAt: '2026-01-01T00:00:00Z',
  emailVerified: true,
};

export const AuthService = {
  /**
   * Log in user via email/handle + password or OTP.
   */
  async login(payload: LoginRequest): Promise<AuthResponse> {
    await simulateNetworkDelay();

    if (payload.emailOrUsername.toLowerCase().includes('invalid')) {
      throw new Error('INVALID_CREDENTIALS: User account not found or password incorrect.');
    }

    const token = 'mock_jwt_access_token_' + Date.now();
    const refreshToken = 'mock_jwt_refresh_token_' + Date.now();
    await AuthStorage.setAccessToken(token);
    await AuthStorage.setRefreshToken(refreshToken);

    return {
      user: {
        ...MOCK_USER,
        username: payload.emailOrUsername.includes('@') ? 'KrewMaster99' : payload.emailOrUsername,
      },
      accessToken: token,
      refreshToken,
      expiresIn: 86400,
    };
  },

  /**
   * Register a new user account.
   */
  async signup(payload: SignupRequest): Promise<AuthResponse> {
    await simulateNetworkDelay();

    if (payload.email.includes('taken')) {
      throw new Error('EMAIL_EXISTS: An account with this email already exists.');
    }

    const token = 'mock_jwt_access_token_' + Date.now();
    const refreshToken = 'mock_jwt_refresh_token_' + Date.now();
    await AuthStorage.setAccessToken(token);
    await AuthStorage.setRefreshToken(refreshToken);

    return {
      user: {
        id: `user_${Date.now()}`,
        email: payload.email,
        username: payload.username,
        createdAt: new Date().toISOString(),
        emailVerified: false,
      },
      accessToken: token,
      refreshToken,
      expiresIn: 86400,
    };
  },

  /**
   * Verify email or SMS OTP code.
   */
  async verifyOtp(payload: VerifyOtpRequest): Promise<AuthResponse> {
    await simulateNetworkDelay();

    if (payload.code === '000000') {
      throw new Error('INVALID_OTP: The verification code entered is invalid or expired.');
    }

    const token = 'mock_jwt_access_token_verified_' + Date.now();
    await AuthStorage.setAccessToken(token);

    return {
      user: {
        ...MOCK_USER,
        emailVerified: true,
      },
      accessToken: token,
      refreshToken: 'mock_jwt_refresh_token_verified',
      expiresIn: 86400,
    };
  },

  /**
   * Request password reset link/code.
   */
  async forgotPassword(payload: ForgotPasswordRequest): Promise<{ success: boolean; message: string }> {
    await simulateNetworkDelay();
    return {
      success: true,
      message: `Password reset verification sent to ${payload.email}`,
    };
  },

  /**
   * Reset password with valid token.
   */
  async resetPassword(payload: ResetPasswordRequest): Promise<{ success: boolean }> {
    await simulateNetworkDelay();
    if (!payload.resetToken || payload.resetToken === 'expired') {
      throw new Error('TOKEN_EXPIRED: Password reset link has expired.');
    }
    return { success: true };
  },

  /**
   * Fetch current authenticated session user.
   */
  async getCurrentUser(): Promise<AuthUser | null> {
    await simulateNetworkDelay(150);
    const token = await AuthStorage.getAccessToken();
    if (!token) return null;
    return MOCK_USER;
  },

  /**
   * Terminate active session and wipe tokens.
   */
  async logout(): Promise<void> {
    await simulateNetworkDelay(100);
    await AuthStorage.clearTokens();
  },
};
