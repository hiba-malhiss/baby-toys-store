import React from 'react';
import { useTranslation } from 'react-i18next';
import { Flex, TextArea } from '@baby-toys/ui-kit';
import { Control } from 'react-hook-form';
import FormFieldWrapper from '../../components/FormFieldWrapper/FormFieldWrapper';
import { HomePageFormValues } from './homePage.helper';

interface Props {
  locale: string;
  control: Control<HomePageFormValues>;
  heroBanners: HomePageFormValues['heroBanners'];
}

const HeroBannersSection: React.FC<Props> = ({ locale, control, heroBanners }) => {
  const { t } = useTranslation();
  return (
    <Flex direction="vertical" spacing="l">
      {heroBanners.map((banner, idx) => {
        if (banner.locale !== locale) return null;
        const position = heroBanners.slice(0, idx).filter((b) => b.locale === locale).length + 1;
        return (
          <FormFieldWrapper
            name={`heroBanners.${idx}.text`}
            control={control}
            label={t('homepage.heroBanners.bannerText', { position, locale: locale.toUpperCase() })
              .replace('{position}', position)
              .replace('{locale}', locale.toUpperCase())}
            fullWidth
            required
          >
            <TextArea rows={3} />
          </FormFieldWrapper>
        );
      })}
    </Flex>
  );
};

export default HeroBannersSection;
