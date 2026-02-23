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
    const secs = err.retryAfterSeconds;
    const twelveHours = 12 * 60 * 60;
    const oneHour = 60 * 60;

    if (secs >= twelveHours) {
      toast.error(
        t(`${i18nKey}.tomorrow`, {
          defaultValue: 'Too many attempts. Please try again tomorrow.',
        })
      );
      return true;
    }

    if (secs >= oneHour) {
      const hours = Math.ceil(secs / oneHour);
      toast.error(
        t(`${i18nKey}.hours`, {
          defaultValue: 'Too many attempts. Please try again in {{hours}} hour(s).',
          hours,
        })
      );
      return true;
    }

    const mins = Math.ceil(secs / 60);
    toast.error(
      t(`${i18nKey}.minutes`, {
        defaultValue: 'Too many attempts. Please try again in {{mins}} minute(s).',
        mins,
      })
    );
    return true;
  }
  return false;
}
