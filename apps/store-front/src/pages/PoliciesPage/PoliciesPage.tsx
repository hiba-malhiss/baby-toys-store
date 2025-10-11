import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageContainer } from '../../components/Layout/PageContainer/PageContainer.tsx';
import { AccordionGroup, Accordion } from '@baby-toys/ui-kit';
import { useStoreSettings } from '../../api/settingsApi';
import { useTranslation } from 'react-i18next';

const PoliciesPage: React.FC = () => {
  const { data: settings, isLoading } = useStoreSettings();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedPolicy = searchParams.get('section') || '';
  const { t } = useTranslation('common');

  const policies = useMemo(
    () => [
      {
        key: 'returnPolicy',
        title: t('policies.returnPolicy'),
        content: settings?.policies?.returnPolicy || '',
      },
      {
        key: 'shippingPolicy',
        title: t('policies.shippingPolicy'),
        content: settings?.policies?.shippingPolicy || '',
      },
      {
        key: 'cancelPolicy',
        title: t('policies.cancelPolicy'),
        content: settings?.policies?.cancelPolicy || '',
      },
    ],
    [settings?.policies, t]
  );

  const handleAccordionToggle = (key: string) => {
    const current = searchParams.get('section') || '';
    setSearchParams({ section: current === key ? '' : key });
  };

  return (
    <PageContainer header={t('policies.header')} isLoading={isLoading} className="bts-marginBxxl">
      <AccordionGroup activeKey={selectedPolicy} onChange={(key) => handleAccordionToggle(key)}>
        {policies.map(({ key, title, content }) => (
          <Accordion
            key={key}
            header={title}
            isOpen={selectedPolicy === key}
            defaultOpen={selectedPolicy === key}
            iconPosition="left"
          >
            {content}
          </Accordion>
        ))}
      </AccordionGroup>
    </PageContainer>
  );
};

export default PoliciesPage;
