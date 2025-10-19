import { StyleSheet } from 'react-native';
import { tokens } from '@pwn/theme';

export const styles = StyleSheet.create({
  topBar: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: tokens.colors.bgSecondary,
    borderBottomWidth: 1,
    borderColor: tokens.colors.border,
  },
  productColumn: {
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  loadingText: {
    color: tokens.colors.textMuted,
  },
  drawer: {
    width: '100%',
    maxHeight: '80%',
    backgroundColor: tokens.colors.background,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  drawerHeader: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: tokens.colors.border,
  },
  drawerTitle: {
    fontWeight: '700',
    fontSize: 16,
  },
  filterHeading: {
    fontWeight: '700',
    fontSize: 14,
    marginBottom: 4,
  },
  colorBox: {
    width: 32,
    height: 32,
    borderRadius: 999,
    borderWidth: 2,
    marginRight: 8,
    marginBottom: 8,
  },
});
