import { useEffect } from 'react';
import { useThemeSettings } from '../api/settingsApi';
import { setTranslationEnabled, getTranslationEnabled } from '../i18n/locale';

/**
 * Fetches the translationEnabled flag from the backend and syncs it to
 * localStorage so getSupportedLocales() returns the correct list.
 *
 * Mount this once near the app root (e.g. inside AuthProvider / App).
 * Returns the current flag value for conditional rendering.
 */
export function useTranslationSetting(): boolean {
  const { data: themeData } = useThemeSettings();

  useEffect(() => {
    if (themeData?.translationEnabled !== undefined) {
      setTranslationEnabled(themeData.translationEnabled);
    }
  }, [themeData?.translationEnabled]);

  // Return current value (may be from localStorage before API responds)
  return getTranslationEnabled();
}
