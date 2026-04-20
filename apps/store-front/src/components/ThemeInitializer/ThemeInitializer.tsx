import { useEffect } from 'react';
import { useStoreFrontThemeSettings } from '../../api/settingsApi';
import { applyThemeSettings } from '@baby-toys/ui-kit';

/**
 * Fetches theme settings from the backend and applies CSS variable overrides.
 * Renders nothing — purely a side-effect component mounted once near the app root.
 */
const ThemeInitializer: React.FC = () => {
  const { data: themeSettings } = useStoreFrontThemeSettings();

  useEffect(() => {
    if (themeSettings) {
      applyThemeSettings(themeSettings);
    }
  }, [themeSettings]);

  return null;
};

export default ThemeInitializer;
