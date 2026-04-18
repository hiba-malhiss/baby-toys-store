import { useTranslationSetting } from './useTranslationSetting';
import { getSupportedLocales } from '../i18n/locale';

/**
 * Reactive hook that returns the active locale list.
 * Re-renders when the translationEnabled setting changes.
 *
 * Use this in components that loop over locales for tabs/validation.
 * Falls back to getSupportedLocales() for non-React contexts.
 */
export function useLocales(): string[] {
  // Calling this hook ensures the component re-renders when the flag changes
  useTranslationSetting();
  return getSupportedLocales();
}
