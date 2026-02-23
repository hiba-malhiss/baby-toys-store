export class RateLimitError extends Error {
  retryAfterSeconds?: number;
  reason?: string;

  constructor(message: string, retryAfterSeconds?: number, reason?: string) {
    super(message);
    this.name = 'RateLimitError';
    this.retryAfterSeconds = retryAfterSeconds;
    this.reason = reason;
  }
}

/**
 * Centralized handler for RateLimitError.
 * Returns true if handled (i.e., a cooldown toast was shown), false otherwise.
 */
export function handleRateLimit(
  err: unknown,
  toast: { error: (msg: string) => void },
  t: (key: string, params?: Record<string, any>) => string,
  i18nKey: string
): boolean {
  if (err instanceof RateLimitError && err.retryAfterSeconds && err.retryAfterSeconds > 0) {
    const mins = Math.ceil(err.retryAfterSeconds / 60);
    toast.error(
      t(i18nKey, {
        defaultValue: 'Too many attempts. Please try again in {{mins}} minute(s).',
        mins,
      })
    );
    return true;
  }
  return false;
}
