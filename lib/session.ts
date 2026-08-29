/**
 * SynKrew — Session & Auth Expiry State Manager
 * Handles mid-session expiration, return-path preservation, and re-authentication redirects.
 */

class SessionManager {
  private static instance: SessionManager;
  private returnPath: string | null = null;
  private isExpired: boolean = false;

  private constructor() {}

  public static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  /**
   * Flag the current session as expired and preserve the target destination route.
   */
  public expireSession(currentPath?: string): void {
    this.isExpired = true;
    if (currentPath) {
      this.returnPath = currentPath;
    }
  }

  /**
   * Retrieve the preserved return path after re-authenticating.
   */
  public getReturnPath(): string {
    const path = this.returnPath || '/(groups)';
    return path;
  }

  /**
   * Reset session expiry status and clear stored return route.
   */
  public restoreSession(): string {
    const target = this.getReturnPath();
    this.isExpired = false;
    this.returnPath = null;
    return target;
  }

  /**
   * Check if session is marked as expired.
   */
  public hasExpired(): boolean {
    return this.isExpired;
  }
}

export const sessionManager = SessionManager.getInstance();
