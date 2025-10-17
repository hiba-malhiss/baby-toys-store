import { StyleSheet } from 'react-native';
import { tokens } from '@pwn/theme';

export const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 24,
    backgroundColor: tokens.colors.background,
  },
  banner: {
    width: '100%',
    height: 280,
    justifyContent: 'center',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  bannerContent: {
    paddingHorizontal: 20,
  },
  bannerTitle: {
    color: tokens.colors.primary,
    fontSize: 34,
    fontWeight: '800',
    textShadowColor: tokens.colors.white,
    textShadowOffset: { width: 2, height: 0 },
    textShadowRadius: 0,
  },
  bannerSubtitle: {
    marginTop: 8,
    color: tokens.colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  sectionHeaderTopPicks: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  sectionTitleTopPicks: {
    fontSize: 20,
    fontWeight: '800',
    color: tokens.colors.textPrimary,
  },
  categoriesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  categoryButton: {
    width: '48%',
    marginBottom: 12,
  },
  categoryCard: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    backgroundColor: tokens.colors.bgSecondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
  categoryImage: {
    width: 96,
    height: 96,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: tokens.colors.bgAvatar,
  },
  categoryLabel: {
    color: tokens.colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  sortTabsWrap: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 12,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    marginRight: 8,
  },
  chipDefault: {
    borderColor: tokens.colors.border,
    backgroundColor: tokens.colors.bgSecondary,
  },
  chipSelected: {
    backgroundColor: tokens.colors.primarySoft,
    borderColor: tokens.colors.primary,
  },
  chipLabel: {
    color: tokens.colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  chipLabelSelected: {
    color: tokens.colors.primary,
  },
  productsRow: {
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
});
