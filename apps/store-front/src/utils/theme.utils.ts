export interface ThemeSettings {
  primaryColor?: string;
  accentColor?: string;
  secondaryColor?: string;
  fontFamily?: string;
  themeName?: string;
}

const GOOGLE_FONT_LINK_ID = 'dynamic-google-font';

const FONT_IMPORT_MAP: Record<string, string> = {
  "'Poppins', sans-serif":
    'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap',
  "'Playfair Display', serif":
    'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap',
  "'Montserrat', sans-serif":
    'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap',
  "'Inter', sans-serif":
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
  "'Cormorant Garamond', serif":
    'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&display=swap',
  "'Lato', sans-serif":
    'https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap',
  "'DM Sans', sans-serif":
    'https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap',
  "'Nunito', sans-serif":
    'https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700&display=swap',
  "'Comfortaa', sans-serif": '', // local font — no external import needed
};

function loadGoogleFont(fontFamily: string): void {
  const url = FONT_IMPORT_MAP[fontFamily];
  const existing = document.getElementById(GOOGLE_FONT_LINK_ID);
  if (existing) existing.remove();
  if (url) {
    const link = document.createElement('link');
    link.id = GOOGLE_FONT_LINK_ID;
    link.rel = 'stylesheet';
    link.href = url;
    document.head.appendChild(link);
  }
}

export function applyThemeSettings(settings: ThemeSettings): void {
  const root = document.documentElement;

  // If themeName is selected, use preset settings and ignore individual settings
  let themeToApply: Omit<ThemeSettings, 'themeName'> = {};

  if (!settings.themeName) {
    // Use individual settings
    themeToApply = {
      primaryColor: settings.primaryColor,
      accentColor: settings.accentColor,
      secondaryColor: settings.secondaryColor,
      fontFamily: settings.fontFamily,
    };
  }

  if (themeToApply.primaryColor) {
    root.style.setProperty('--color-primary', themeToApply.primaryColor);
    root.style.setProperty('--color-primary-dark', darkenHex(themeToApply.primaryColor, 0.1));
    root.style.setProperty('--color-primary-hover', darkenHex(themeToApply.primaryColor, 0.2));
    root.style.setProperty('--color-primary-light', lightenHex(themeToApply.primaryColor, 0.88));
  }

  if (themeToApply.accentColor) {
    root.style.setProperty('--color-accent', themeToApply.accentColor);
    root.style.setProperty('--color-accent-hover', darkenHex(themeToApply.accentColor, 0.1));
    root.style.setProperty('--color-accent-light', lightenHex(themeToApply.accentColor, 0.88));
    root.style.setProperty('--color-accent-dark', darkenHex(themeToApply.accentColor, 0.2));
  }

  if (themeToApply.secondaryColor) {
    root.style.setProperty('--color-secondary', themeToApply.secondaryColor);
    root.style.setProperty('--color-secondary-hover', darkenHex(themeToApply.secondaryColor, 0.1));
    root.style.setProperty('--color-secondary-dark', darkenHex(themeToApply.secondaryColor, 0.2));
    root.style.setProperty(
      '--color-secondary-light',
      lightenHex(themeToApply.secondaryColor, 0.85)
    );
  }

  if (themeToApply.fontFamily) {
    root.style.setProperty('--font-primary', themeToApply.fontFamily);
    loadGoogleFont(themeToApply.fontFamily);
  }

  // Add wave.svg background only for kids theme
  if (settings.themeName === 'theme-kids') {
    root.style.setProperty('--wave-background', "url('/assets/images/wave.svg')");
  } else {
    root.style.setProperty('--wave-background', 'none');
  }
}

// ─── Color helpers ───────────────────────────────────────────────────────────

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return [r, g, b];
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

function darkenHex(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(r * (1 - amount), g * (1 - amount), b * (1 - amount));
}

function lightenHex(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(r + (255 - r) * amount, g + (255 - g) * amount, b + (255 - b) * amount);
}
