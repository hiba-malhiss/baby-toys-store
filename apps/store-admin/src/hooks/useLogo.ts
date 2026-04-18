import { useThemeSettings } from '../api/settingsApi';

const FALLBACK_LOGO = '/assets/kit-images/logo.png';

/**
 * Returns the store logo URL.
 * If an admin has uploaded a custom logo via the Theme settings, it takes priority.
 * Otherwise falls back to the bundled static logo.
 */
export function useLogo(): string {
  const { data: themeSettings } = useThemeSettings();
  return themeSettings?.logoUrl || FALLBACK_LOGO;
}
