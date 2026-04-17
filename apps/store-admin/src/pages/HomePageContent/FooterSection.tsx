import React from 'react';
import { useTranslation } from 'react-i18next';
import { Flex, Text, ImageUploader } from '@baby-toys/ui-kit';

interface FooterSectionProps {
  footerUploaderProps: any;
}

const FooterSection: React.FC<FooterSectionProps> = ({ footerUploaderProps }) => {
  const { t } = useTranslation();

  return (
    <Flex direction="vertical" spacing="l" fullWidth>
      <Text color="muted" size="sm">
        {t('homepage.footer.description', {
          defaultValue:
            'Upload an image shown in the storefront footer — e.g. a payment methods strip, partner logos, or a decorative banner.',
        })}
      </Text>
      <ImageUploader {...footerUploaderProps} maxImages={1} />
    </Flex>
  );
};

export default FooterSection;
