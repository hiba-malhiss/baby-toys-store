import React from 'react';
import { Flex, Button } from '@baby-toys/ui-kit';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  return (
    <Flex spacing="s" align="center" fullHeight>
      <Button
        color="light"
        withoutPadding
        appearance="link"
        size="xsmall"
        onClick={() => i18n.changeLanguage('en')}
      >
        EN
      </Button>
      <div>|</div>
      <Button
        color="light"
        withoutPadding
        appearance="link"
        size="xsmall"
        onClick={() => i18n.changeLanguage('ar')}
      >
        AR
      </Button>
    </Flex>
  );
};

export default LanguageSwitcher;
