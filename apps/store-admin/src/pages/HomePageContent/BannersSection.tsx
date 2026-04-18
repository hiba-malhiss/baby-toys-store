import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  Flex,
  TabBar,
  TabBarItem,
  Divider,
  StringInput,
  Select,
  ImageUploader,
} from '@baby-toys/ui-kit';
import { Control } from 'react-hook-form';
import FormFieldWrapper from '../../components/FormFieldWrapper/FormFieldWrapper';
import { useLocales } from '../../hooks/useLocales';
import { HomePageFormValues } from './homePage.helper';
import { BannerTextAlignment, VerticalAlignment } from '../../api/types/homePage';

interface Props {
  control: Control<HomePageFormValues>;
  banner1UploaderProps: any;
  banner2UploaderProps: any;
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

const BannersSection: React.FC<Props> = ({
  control,
  banner1UploaderProps,
  banner2UploaderProps,
}) => {
  const { t } = useTranslation();
  const locales = useLocales();

  const renderSlot = (slotIndex: 0 | 1) => (
    <Card fullWidth>
      <Flex direction="vertical" spacing="l" fullWidth>
        <TabBar
          fullWidth
          size="small"
          tabs={locales.map((l) => ({
            header: `${l.toUpperCase()} (${l})`,
            value: `${l}-banner-${slotIndex}`,
          }))}
        >
          {locales.map((locale, localeIndex) => {
            const realIndex = localeIndex * 2 + slotIndex;

            const label = t('homepage.banners.bannerText', {
              position: slotIndex + 1,
              locale: locale.toUpperCase(),
            });

            return (
              <TabBarItem key={locale} value={`${locale}-banner-${slotIndex}`}>
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
              </TabBarItem>
            );
          })}
        </TabBar>

        <Divider />

        <ImageUploader {...(slotIndex === 0 ? banner1UploaderProps : banner2UploaderProps)} />
      </Flex>
    </Card>
  );

  return (
    <Flex direction="vertical" spacing="xl" fullWidth>
      {renderSlot(0)}
      {renderSlot(1)}
    </Flex>
  );
};

export default BannersSection;
