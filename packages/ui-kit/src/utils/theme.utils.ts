export interface ThemeSettings {
  primaryColor?: string;
  accentColor?: string;
  secondaryColor?: string;
  fontFamily?: string;
  themeName?: string;
}

export const THEME_PRESET_OPTIONS = [
  { label: 'None (Custom)', value: '' },
  { label: 'Kids', value: 'theme-kids' },
  { label: 'Elegant', value: 'theme-elegant' },
  { label: 'Luxury', value: 'theme-luxury' },
];

export const FONT_OPTIONS = [
  { label: 'Comfortaa (Default - Playful)', value: "'Comfortaa', sans-serif" },
  { label: 'Poppins (Modern & Clean)', value: "'Poppins', sans-serif" },
  { label: 'Montserrat (Bold & Strong)', value: "'Montserrat', sans-serif" },
  { label: 'Inter (Professional & Minimal)', value: "'Inter', sans-serif" },
  { label: 'Playfair Display (Elegant & Serif)', value: "'Playfair Display', serif" },
  { label: 'Cormorant Garamond (Luxury & Classic)', value: "'Cormorant Garamond', serif" },
  { label: 'Lato (Friendly & Readable)', value: "'Lato', sans-serif" },
  { label: 'DM Sans (Clean & Humanist)', value: "'DM Sans', sans-serif" },
  { label: 'Nunito (Rounded & Friendly)', value: "'Nunito', sans-serif" },
];

const GOOGLE_FONT_LINK_ID = 'dynamic-google-font';

const FONT_IMPORT_MAP: Record<string, string> = {
  "'Comfortaa', sans-serif": 'Comfortaa:wght@300;400;500;600;700',
  "'Poppins', sans-serif": 'Poppins:wght@300;400;500;600;700',
  "'Montserrat', sans-serif": 'Montserrat:wght@300;400;500;600;700',
  "'Inter', sans-serif": 'Inter:wght@300;400;500;600;700',
  "'Playfair Display', serif": 'Playfair+Display:wght@400;500;600;700',
  "'Cormorant Garamond', serif": 'Cormorant+Garamond:wght@300;400;500;600;700',
  "'Lato', sans-serif": 'Lato:wght@300;400;500;600;700',
  "'DM Sans', sans-serif": 'DM+Sans:wght@300;400;500;600;700',
  "'Nunito', sans-serif": 'Nunito:wght@300;400;500;600;700',
};

function loadGoogleFont(fontFamily: string): void {
  const fontUrl = FONT_IMPORT_MAP[fontFamily];
  if (!fontUrl) return;

  // Check if font is already loaded
  const existingLink = document.getElementById(GOOGLE_FONT_LINK_ID);
  if (existingLink) {
    // Update existing link if different font
    if (
      existingLink.getAttribute('href') !==
      `https://fonts.googleapis.com/css2?family=${fontUrl}&display=swap`
    ) {
      existingLink.setAttribute(
        'href',
        `https://fonts.googleapis.com/css2?family=${fontUrl}&display=swap`
      );
    }
    return;
  }

  // Create and append new link
  const link = document.createElement('link');
  link.id = GOOGLE_FONT_LINK_ID;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${fontUrl}&display=swap`;
  document.head.appendChild(link);
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map((x) =>
        Math.max(0, Math.min(255, Math.round(x)))
          .toString(16)
          .padStart(2, '0')
      )
      .join('')
  );
}

function darkenHex(hex: string, factor: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  return rgbToHex(rgb.r * (1 - factor), rgb.g * (1 - factor), rgb.b * (1 - factor));
}

function lightenHex(hex: string, factor: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  return rgbToHex(
    Math.min(255, rgb.r + (255 - rgb.r) * factor),
    Math.min(255, rgb.g + (255 - rgb.g) * factor),
    Math.min(255, rgb.b + (255 - rgb.b) * factor)
  );
}

export function applyThemeSettings(settings: ThemeSettings): void {
  const root = document.documentElement;

  // Remove any existing theme classes
  root.classList.remove('theme-kids', 'theme-elegant', 'theme-luxury');

  // Apply theme class if themeName is selected
  if (settings.themeName) {
    root.classList.add(settings.themeName);
  }

  // Apply individual settings only if no theme is selected
  if (!settings.themeName) {
    if (settings.primaryColor) {
      root.style.setProperty('--color-primary', settings.primaryColor);
      root.style.setProperty('--color-primary-dark', darkenHex(settings.primaryColor, 0.1));
      root.style.setProperty('--color-primary-hover', darkenHex(settings.primaryColor, 0.2));
      root.style.setProperty('--color-primary-light', lightenHex(settings.primaryColor, 0.88));
    }

    if (settings.accentColor) {
      root.style.setProperty('--color-accent', settings.accentColor);
      root.style.setProperty('--color-accent-hover', darkenHex(settings.accentColor, 0.1));
      root.style.setProperty('--color-accent-light', lightenHex(settings.accentColor, 0.88));
      root.style.setProperty('--color-accent-dark', darkenHex(settings.accentColor, 0.2));
    }

    if (settings.secondaryColor) {
      root.style.setProperty('--color-secondary', settings.secondaryColor);
      root.style.setProperty('--color-secondary-hover', darkenHex(settings.secondaryColor, 0.1));
      root.style.setProperty('--color-secondary-dark', darkenHex(settings.secondaryColor, 0.2));
      root.style.setProperty('--color-secondary-light', lightenHex(settings.secondaryColor, 0.85));
    }

    if (settings.fontFamily) {
      root.style.setProperty('--font-primary', settings.fontFamily);
      loadGoogleFont(settings.fontFamily);
    }
  }

  // Add wave.svg background only for kids theme
  if (settings.themeName === 'theme-kids') {
    root.style.setProperty('--wave-background', "url('/assets/images/wave.svg')");
  } else {
    root.style.setProperty('--wave-background', 'none');
  }
}
