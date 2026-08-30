/**
 * SynKrew — Secure Auth Storage Helper
 * Path: lib/auth-storage.ts
 *
 * Provides persistent, encrypted token storage with web/in-memory fallback.
 */

import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const ACCESS_TOKEN_KEY = 'synkrew_access_token';
const REFRESH_TOKEN_KEY = 'synkrew_refresh_token';

// In-memory fallback for web environment
let memoryStorage: Record<string, string> = {
  [ACCESS_TOKEN_KEY]: 'mock_jwt_token_arcade_session_dev',
  [REFRESH_TOKEN_KEY]: 'mock_refresh_token_dev',
};

export const AuthStorage = {
  async getAccessToken(): Promise<string | null> {
    if (Platform.OS === 'web') {
      return memoryStorage[ACCESS_TOKEN_KEY] || null;
    }
    try {
      return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    } catch {
      return memoryStorage[ACCESS_TOKEN_KEY] || null;
    }
  },

  async setAccessToken(token: string): Promise<void> {
    if (Platform.OS === 'web') {
      memoryStorage[ACCESS_TOKEN_KEY] = token;
      return;
    }
    try {
      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
    } catch {
      memoryStorage[ACCESS_TOKEN_KEY] = token;
    }
  },

  async getRefreshToken(): Promise<string | null> {
    if (Platform.OS === 'web') {
      return memoryStorage[REFRESH_TOKEN_KEY] || null;
    }
    try {
      return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    } catch {
      return memoryStorage[REFRESH_TOKEN_KEY] || null;
    }
  },

  async setRefreshToken(token: string): Promise<void> {
    if (Platform.OS === 'web') {
      memoryStorage[REFRESH_TOKEN_KEY] = token;
      return;
    }
    try {
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
    } catch {
      memoryStorage[REFRESH_TOKEN_KEY] = token;
    }
  },

  async clearTokens(): Promise<void> {
    memoryStorage = {};
    if (Platform.OS !== 'web') {
      try {
        await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
        await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
      } catch {
        // Ignore fallback deletion error
      }
    }
  },
};
