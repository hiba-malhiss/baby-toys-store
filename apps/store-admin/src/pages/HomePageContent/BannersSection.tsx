import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Flex, StringInput, Select } from '@baby-toys/ui-kit';
import { Control } from 'react-hook-form';
import FormFieldWrapper from '../../components/FormFieldWrapper/FormFieldWrapper';
import { HomePageFormValues } from './homePage.helper';
import { BannerTextAlignment, VerticalAlignment } from '../../api/types/homePage';

interface Props {
  locale: string;
  control: Control<HomePageFormValues>;
  banners: HomePageFormValues['banners'];
  slotIndex: number; // 0 or 1
}

const alignmentOptions = [
  { label: 'Left', value: BannerTextAlignment.LEFT },
  { label: 'Center', value: BannerTextAlignment.CENTER },
  { label: 'Right', value: BannerTextAlignment.RIGHT },
];

const verticalAlignmentOptions = [
  { label: 'Top', value: VerticalAlignment.TOP },
  { label: 'Center', value: VerticalAlignment.CENTER },
  { label: 'Bottom', value: VerticalAlignment.BOTTOM },
];

const BannersSection: React.FC<Props> = ({ locale, control, banners, slotIndex }) => {
  const { t } = useTranslation();

  // Get banners for this locale
  const localeBanners = useMemo(
    () => banners.filter((b) => b.locale === locale),
    [banners, locale]
  );

  const selectedBanner = localeBanners[slotIndex];

  if (!selectedBanner) return null;

  // Find actual index in original array (needed for react-hook-form path)
  const realIndex = banners.findIndex((b) => b.locale === locale && b === selectedBanner);

  const label = t('homepage.banners.bannerText', {
    position: slotIndex + 1,
    locale: locale.toUpperCase(),
  });

  return (
    <Flex direction="vertical" fullWidth spacing="l">
      <FormFieldWrapper
        name={`banners.${realIndex}.text`}
        control={control}
        label={label}
        fullWidth
        required
      >
        <StringInput />
      </FormFieldWrapper>

      <Flex fullWidth spacing="l">
        <FormFieldWrapper
          name={`banners.${realIndex}.alignment`}
          control={control}
          fullWidth
          label={t('homepage.banners.alignment')}
        >
          <Select options={alignmentOptions} />
        </FormFieldWrapper>

        <FormFieldWrapper
          name={`banners.${realIndex}.verticalAlignment`}
          control={control}
          fullWidth
          label={t('homepage.banners.verticalAlignment')}
        >
          <Select options={verticalAlignmentOptions} />
        </FormFieldWrapper>
      </Flex>
    </Flex>
  );
};

export default BannersSection;
