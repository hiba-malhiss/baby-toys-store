// ─── Locale storage ───────────────────────────────────────────────────────────

export function getAppLocale(): string {
  try {
    return (
      localStorage.getItem('app.locale') ||
      localStorage.getItem('i18nextLng') ||
      navigator.language ||
      'ar'
    )
      .slice(0, 2)
      .toLowerCase();
  } catch {
    return 'ar';
  }
}

export function setAppLocale(locale: string): void {
  try {
    localStorage.setItem('app.locale', locale);
  } catch {
    // ignore storage errors
  }
}

// ─── Translation flag ─────────────────────────────────────────────────────────

const TRANSLATION_ENABLED_KEY = 'translation_enabled';

/** Read the flag. Defaults to true (both AR + EN) when not set. */
export function getTranslationEnabled(): boolean {
  try {
    const stored = localStorage.getItem(TRANSLATION_ENABLED_KEY);
    if (stored === null) return true; // default: enabled
    return stored !== 'false';
  } catch {
    return true;
  }
}

/** Persist the flag so it survives page reloads without waiting for the API. */
export function setTranslationEnabled(enabled: boolean): void {
  try {
    localStorage.setItem(TRANSLATION_ENABLED_KEY, String(enabled));
  } catch {
    // ignore storage errors
  }
}

/**
 * Returns the active locale list.
 * - Translation enabled  → ['ar', 'en']
 * - Translation disabled → ['ar']
 *
 * All components that drive locale tabs/loops call this function, so this single
 * change controls validation and UI everywhere.
 */
export function getSupportedLocales(): string[] {
  return getTranslationEnabled() ? ['ar', 'en'] : ['ar'];
}
