import React from 'react';
import { Card, Flex, Select, StringInput, TextArea, Option } from '@baby-toys/ui-kit';
import FormFieldWrapper from '../../components/FormFieldWrapper/FormFieldWrapper';
import { HomePageFormValues } from './homePage.helper';
import { Control } from 'react-hook-form';

interface Props {
  locale: string;
  control: Control<HomePageFormValues>;
  infoCards: HomePageFormValues['infoCards'];
}

const InfoCardsSection: React.FC<Props> = ({ locale, control, infoCards }) => {
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
                label={`Title (${locale.toUpperCase()})`}
                fullWidth
                required
              >
                <StringInput />
              </FormFieldWrapper>

              <FormFieldWrapper
                name={`infoCards.${idx}.subtitle`}
                control={control}
                label={`Subtitle (${locale.toUpperCase()})`}
                fullWidth
                required
              >
                <TextArea rows={3} />
              </FormFieldWrapper>

              <FormFieldWrapper
                name={`infoCards.${idx}.icon`}
                control={control}
                label="Icon"
                fullWidth
                required
              >
                <StringInput placeholder="e.g., lucide:truck" />
              </FormFieldWrapper>

              <FormFieldWrapper
                name={`infoCards.${idx}.appearance`}
                control={control}
                label="Appearance"
                fullWidth
                required
              >
                <Select>
                  <Option value="primary" key="primary">
                    Primary
                  </Option>
                  <Option value="info" key="info">
                    Info
                  </Option>
                  <Option value="success" key="success">
                    Success
                  </Option>
                  <Option value="warning" key="warning">
                    Warning
                  </Option>
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
