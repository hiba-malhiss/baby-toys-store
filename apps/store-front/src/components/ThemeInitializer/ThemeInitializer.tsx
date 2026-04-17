import { useEffect } from 'react';
import { useStoreFrontThemeSettings } from '../../api/settingsApi';
import { applyThemeSettings } from '../../utils/theme.utils';

/**
 * Fetches theme settings from the backend and applies them as CSS variables on the document root.
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
