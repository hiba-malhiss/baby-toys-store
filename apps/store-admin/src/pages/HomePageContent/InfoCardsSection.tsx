import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Flex, Select, TextArea, Option, StringInput } from '@baby-toys/ui-kit';
import FormFieldWrapper from '../../components/FormFieldWrapper/FormFieldWrapper';
import { HomePageFormValues } from './homePage.helper';
import { Control } from 'react-hook-form';

interface Props {
  locale: string;
  control: Control<HomePageFormValues>;
  infoCards: HomePageFormValues['infoCards'];
}

const InfoCardsSection: React.FC<Props> = ({ locale, control, infoCards }) => {
  const { t } = useTranslation();
  return (
    <Flex direction="vertical" spacing="l" fullWidth>
      {infoCards.map((card, idx) => {
        if (card.locale !== locale) return null;
        return (
          <Card key={(card as any)?.fieldId || card.id || idx} fullWidth>
            <Flex direction="vertical" spacing="l">
              <FormFieldWrapper
                name={`infoCards.${idx}.title`}
                control={control}
                label={t('homepage.infoCards.title', { locale: locale.toUpperCase() }).replace(
                  '{locale}',
                  locale.toUpperCase()
                )}
                fullWidth
                required
              >
                <StringInput />
              </FormFieldWrapper>

              <FormFieldWrapper
                name={`infoCards.${idx}.subtitle`}
                control={control}
                label={t('homepage.infoCards.subtitle', { locale: locale.toUpperCase() }).replace(
                  '{locale}',
                  locale.toUpperCase()
                )}
                fullWidth
                required
              >
                <TextArea rows={3} />
              </FormFieldWrapper>

              <FormFieldWrapper
                name={`infoCards.${idx}.icon`}
                control={control}
                label={t('homepage.infoCards.icon')}
                fullWidth
                required
              >
                <Select>
                  {Object.entries({
                    truck: t('homepage.infoCards.icons.truck'),
                    star: t('homepage.infoCards.icons.star'),
                    brain: t('homepage.infoCards.icons.brain'),
                    puzzle: t('homepage.infoCards.icons.puzzle'),
                    gift: t('homepage.infoCards.icons.gift'),
                    heart: t('homepage.infoCards.icons.heart'),
                  }).map(([value, label]) => (
                    <Option value={value} key={value}>
                      {label}
                    </Option>
                  ))}
                </Select>
              </FormFieldWrapper>

              <FormFieldWrapper
                name={`infoCards.${idx}.appearance`}
                control={control}
                label={t('homepage.infoCards.appearance')}
                fullWidth
                required
              >
                <Select>
                  {Object.entries({
                    primary: t('homepage.infoCards.appearances.primary'),
                    info: t('homepage.infoCards.appearances.info'),
                    success: t('homepage.infoCards.appearances.success'),
                    warning: t('homepage.infoCards.appearances.warning'),
                  }).map(([value, label]) => (
                    <Option value={value} key={value}>
                      {label}
                    </Option>
                  ))}
                </Select>
              </FormFieldWrapper>
            </Flex>
          </Card>
        );
      })}
    </Flex>
  );
};

export default InfoCardsSection;
