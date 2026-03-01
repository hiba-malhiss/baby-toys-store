import React from 'react';
import { useTranslation } from 'react-i18next';
import { Flex, StringInput, Select } from '@baby-toys/ui-kit';
import { Control } from 'react-hook-form';
import FormFieldWrapper from '../../components/FormFieldWrapper/FormFieldWrapper';
import { HomePageFormValues } from './homePage.helper';
import { BannerTextAlignment, VerticalAlignment } from '../../api/types/homePage.ts';

interface Props {
  control: Control<HomePageFormValues>;
  baseName: string;
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

const MainBannerSection: React.FC<Props> = ({ control, baseName }) => {
  const { t } = useTranslation();

  return (
    <Flex direction="vertical" spacing="l" fullWidth>
      <FormFieldWrapper
        name={`${baseName}.title`}
        control={control}
        label={t('homepage.mainBanner.title')}
        fullWidth
      >
        <StringInput />
      </FormFieldWrapper>

      <FormFieldWrapper
        name={`${baseName}.subtitle`}
        control={control}
        label={t('homepage.mainBanner.subtitle')}
        fullWidth
      >
        <StringInput />
      </FormFieldWrapper>

      <FormFieldWrapper
        name={`${baseName}.ctaText`}
        control={control}
        label={t('homepage.mainBanner.ctaText')}
        fullWidth
      >
        <StringInput />
      </FormFieldWrapper>

      <FormFieldWrapper
        name={`${baseName}.alignment`}
        control={control}
        fullWidth
        label={t('homepage.mainBanner.alignment')}
      >
        <Select options={alignmentOptions} />
      </FormFieldWrapper>

      <FormFieldWrapper
        name={`${baseName}.verticalAlignment`}
        control={control}
        fullWidth
        label={t('homepage.mainBanner.verticalAlignment')}
      >
        <Select options={verticalAlignmentOptions} />
      </FormFieldWrapper>
    </Flex>
  );
};

export default MainBannerSection;
