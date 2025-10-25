interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

export class RateLimiter {
  private windowMs: number;
  private maxRequests: number;

  constructor(windowMs: number = 15 * 60 * 1000, maxRequests: number = 1) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  isRateLimited(key: string): boolean {
    const now = Date.now();
    const record = store[key];

    if (!record) {
      store[key] = {
        count: 1,
        resetTime: now + this.windowMs,
      };
      return false;
    }

    if (now > record.resetTime) {
      store[key] = {
        count: 1,
        resetTime: now + this.windowMs,
      };
      return false;
    }

    if (record.count >= this.maxRequests) {
      return true;
    }

    record.count += 1;
    return false;
  }

  getRemainingTime(key: string): number {
    const record = store[key];
    if (!record) return 0;
    return Math.max(0, record.resetTime - Date.now());
  }
}

// Get rate limit configurations from environment variables
const REGISTER_WINDOW_MS = parseInt(
  process.env.REGISTER_WINDOW_MS || "1296000000"
); // 15 days in ms
const REGISTER_MAX_REQUESTS = parseInt(
  process.env.REGISTER_MAX_REQUESTS || "10"
);
const RESET_PASSWORD_WINDOW_MS = parseInt(
  process.env.RESET_PASSWORD_WINDOW_MS || "1296000000"
); // 15 days in ms
const RESET_PASSWORD_MAX_REQUESTS = parseInt(
  process.env.RESET_PASSWORD_MAX_REQUESTS || "10"
);
const RESEND_OTP_WINDOW_MS = parseInt(
  process.env.RESEND_OTP_WINDOW_MS || "2592000000"
); // 30 days in ms
const RESEND_OTP_MAX_REQUESTS = parseInt(
  process.env.RESEND_OTP_MAX_REQUESTS || "10"
);

// Create instances for different rate limits
export const registerLimiter = new RateLimiter(
  REGISTER_WINDOW_MS,
  REGISTER_MAX_REQUESTS
);
export const resetPasswordLimiter = new RateLimiter(
  RESET_PASSWORD_WINDOW_MS,
  RESET_PASSWORD_MAX_REQUESTS
);
export const resendOTPLimiter = new RateLimiter(
  RESEND_OTP_WINDOW_MS,
  RESEND_OTP_MAX_REQUESTS
);
