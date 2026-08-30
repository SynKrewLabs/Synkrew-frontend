/**
 * SynKrew — API Configuration
 * Path: config/api.ts
 *
 * Environment settings for network and mock data layers.
 */

export const Config = {
  /**
   * API Base URL placeholder for FastAPI backend.
   * Can be overridden via EXPO_PUBLIC_API_URL environment variable.
   */
  API_BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api/v1',

  /**
   * Single toggle flag: set to false when connecting to live backend endpoints.
   */
  USE_MOCK_DATA: true,

  /**
   * Simulated network latency in milliseconds for realistic async state testing.
   */
  MOCK_DELAY_MS: 350,

  /**
   * App version & environment
   */
  APP_ENV: process.env.NODE_ENV || 'development',
} as const;
