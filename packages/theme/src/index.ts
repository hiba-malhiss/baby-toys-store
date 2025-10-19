import { createConfig } from '@gluestack-style/react';
import { UIComponents } from '@gluestack-ui/themed';
import { tokens, gluestackTokens } from './tokens';

export { tokens };

export const uiConfig = createConfig({
  tokens: gluestackTokens,
  components: UIComponents,
  aliases: {
    // spacing
    p: 'padding',
    px: 'paddingHorizontal',
    py: 'paddingVertical',
    pt: 'paddingTop',
    pr: 'paddingRight',
    pb: 'paddingBottom',
    pl: 'paddingLeft',
    m: 'margin',
    mx: 'marginHorizontal',
    my: 'marginVertical',
    mt: 'marginTop',
    mr: 'marginRight',
    mb: 'marginBottom',
    ml: 'marginLeft',
    // layout & size
    w: 'width',
    h: 'height',
    minW: 'minWidth',
    minH: 'minHeight',
    maxW: 'maxWidth',
    maxH: 'maxHeight',
    // colors & borders
    bg: 'backgroundColor',
    rounded: 'borderRadius',
    borderW: 'borderWidth',
    borderColor: 'borderColor',
    // flex
    align: 'alignItems',
    justify: 'justifyContent',
  },
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
