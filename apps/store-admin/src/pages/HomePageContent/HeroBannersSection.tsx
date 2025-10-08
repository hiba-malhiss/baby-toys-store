import React from 'react';
import { Flex, TextArea } from '@baby-toys/ui-kit';
import { Control } from 'react-hook-form';
import FormFieldWrapper from '../../components/FormFieldWrapper/FormFieldWrapper';
import { HomePageFormValues } from './homePage.helper';

interface Props {
  locale: string;
  control: Control<HomePageFormValues>;
  heroBanners: any[];
}

const HeroBannersSection: React.FC<Props> = ({ locale, control, heroBanners }) => {
  return (
    <Flex direction="vertical" spacing="l">
      {heroBanners.map((banner, idx) => {
        if (banner.locale !== locale) return null;
        const position = heroBanners.slice(0, idx).filter((b) => b.locale === locale).length + 1;
        return (
          <FormFieldWrapper
            name={`heroBanners.${idx}.text`}
            control={control}
            label={`Banner ${position} Text (${locale.toUpperCase()})`}
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
