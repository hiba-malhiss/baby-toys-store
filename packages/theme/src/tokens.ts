// Centralized design tokens (single source of truth)
// Sourced from packages/ui-kit/src/styles/constants.scss

export const tokens = {
  colors: {
    // ===== BRAND COLORS =====
    primary: '#1096b5',
    primaryDark: '#0f83b2',
    primaryHover: '#0a6487',
    primaryLight: '#e6f7fb',

    // Accent
    accent: '#f26c62',
    accentHover: '#d9574f',
    accentLight: '#f8e6e5',
    accentDark: '#c54a42',
    accentLightHover: '#ffdad8',

    // Secondary
    secondary: '#7f7f7f',
    secondaryHover: '#6f6f6f',
    secondaryLight: '#eaeaea',
    secondaryLightHover: '#d6d6d6',
    secondaryDark: '#5a5a5a',

    // ===== STATUS COLORS =====
    success: '#25bf0c',
    successHover: '#1fa309',
    successLight: '#f4fff5',
    successDark: '#1a8607',

    warning: '#feb705',
    warningHover: '#e5a504',
    warningLight: '#fffaf4',
    warningDark: '#cc9204',
    warningBrand: '#e87b16',

    info: '#12aee0',
    infoHover: '#0f9bc7',
    infoLight: '#f4faff',
    infoDark: '#0d7ea3',

    danger: '#e74c3c',
    error: '#e74c3c',
    errorHover: '#c0392b',
    errorLight: '#fdedec',
    errorDark: '#a93226',

    // ===== TEXT COLORS =====
    textPrimary: '#171717',
    textSecondary: '#375259',
    textMuted: '#898989',
    textLight: '#ffffff',
    textDark: '#101010',
    textGrey: '#333333',
    textGreyLight: '#555555',
    textGreyDark: '#5c5c5c',
    textReview: '#4a4748',

    // ===== BACKGROUND COLORS =====
    background: '#ffffff',
    bgPrimary: '#ffffff',
    bgSecondary: '#f8f9fa',
    bgTertiary: '#f1f3f4',
    bgInfo: '#f4faff',
    bgWarning: '#fffaf4',
    bgSuccess: '#f4fff5',
    bgError: '#fdedec',
    bgAvatar: '#ccc8c8',
    bgPhoto: '#b9b9b9',
    bgOverlay: 'rgba(0, 0, 0, 0.5)',
    bgHover: '#eaeaea', // secondary-light

    // ===== BORDER & UTILITY COLORS =====
    border: '#e2e8f0',
    borderLight: '#e9ecef',
    borderDark: '#adb5bd',
    bgDisabled: '#f8f9fa',
    textDisabled: '#adb5bd',
    borderDisabled: '#e9ecef',
    disabled: '#d4d4d4',
    disabled2: '#e0e0e0',
    disabledText: '#898989',
    icon: '#a5a5a5',
    iconMuted: '#898989',
    linkHover: '#ffd8cc',

    // Base
    white: '#ffffff',
    black: '#000000',
    transparent: 'transparent',
  },
} as const;

// Gluestack-ready tokens (flattened scale where needed)
export const gluestackTokens = {
  colors: {
    primary50: '#e6f7fb',
    primary100: '#cfeff6',
    primary200: '#b8e7f2',
    primary300: '#a1dfed',
    primary400: '#8ad7e9',
    primary500: '#1096b5',
    primary600: '#0f83b2',
    primary700: '#0a6487',
    primary800: '#084e69',
    primary900: '#06384b',

    accent500: '#f26c62',
    accent600: '#d9574f',
    accent700: '#c54a42',

    success500: '#25bf0c',
    warning500: '#feb705',
    info500: '#12aee0',
    danger500: '#e74c3c',

    text500: '#171717',
    text600: '#101010',
    text700: '#333333',

    border500: '#e2e8f0',
    background500: '#ffffff',
    muted500: '#898989',

    secondary500: '#7f7f7f',
    secondary600: '#6f6f6f',
    secondary700: '#5a5a5a',
    secondary100: '#eaeaea',
    secondary200: '#d6d6d6',

    borderLight500: '#e9ecef',
    borderDark500: '#adb5bd',
    bgPrimary500: '#ffffff',
    bgSecondary500: '#f8f9fa',
    bgTertiary500: '#f1f3f4',
    bgInfo500: '#f4faff',
    bgWarning500: '#fffaf4',
    bgSuccess500: '#f4fff5',
    bgError500: '#fdedec',
  },
} as const;
