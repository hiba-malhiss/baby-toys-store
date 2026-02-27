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
  if (err instanceof RateLimitError) {
    const secs = err.retryAfterSeconds ?? 0;

    // If Retry-After is missing but reason indicates daily limit, show tomorrow as a fallback
    if ((!secs || secs <= 0) && err.reason === 'daily_limit') {
      toast.error(
        t(`${i18nKey}.tomorrow`, {
          defaultValue: 'Too many attempts. Please try again tomorrow.',
        })
      );
      return true;
    }

    // Show "tomorrow" only if the remaining time crosses local midnight
    const now = Date.now();
    const eta = new Date(now + secs * 1000);
    const today = new Date(now);
    const isTomorrow =
      eta.getFullYear() !== today.getFullYear() ||
      eta.getMonth() !== today.getMonth() ||
      eta.getDate() !== today.getDate();

    if (isTomorrow) {
      toast.error(
        t(`${i18nKey}.tomorrow`, {
          defaultValue: 'Too many attempts. Please try again tomorrow.',
        })
      );
      return true;
    }

    const oneHour = 60 * 60;
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
