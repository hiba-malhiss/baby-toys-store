import { createConfig } from '@gluestack-style/react';
import { tokens, gluestackTokens } from './tokens';

export { tokens };

export const uiConfig = createConfig({
  tokens: gluestackTokens,
});

export const navThemeFromTokens = (DefaultTheme: any) => ({
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: tokens.colors.primary,
    background: tokens.colors.background,
    card: tokens.colors.background,
    text: tokens.colors.textPrimary,
    border: tokens.colors.border,
  },
});
