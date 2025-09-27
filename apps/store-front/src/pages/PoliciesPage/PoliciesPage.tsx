import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer/PageContainer.tsx';
import { AccordionGroup, Accordion } from '@baby-toys/ui-kit';
import { useStoreSettings } from '../../api/settingsApi';

const PoliciesPage: React.FC = () => {
  const { data: settings, isLoading } = useStoreSettings();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedPolicy = searchParams.get('section') || '';

  const policies = useMemo(
    () => [
      {
        key: 'returnPolicy',
        title: 'Return Policy',
        content: settings?.policies?.returnPolicy || '',
      },
      {
        key: 'shippingPolicy',
        title: 'Shipping Policy',
        content: settings?.policies?.shippingPolicy || '',
      },
      {
        key: 'cancelPolicy',
        title: 'Cancel Policy',
        content: settings?.policies?.cancelPolicy || '',
      },
    ],
    [settings?.policies]
  );

  const handleAccordionToggle = (key: string) => {
    const current = searchParams.get('section') || '';
    setSearchParams({ section: current === key ? '' : key });
  };

  return (
    <PageContainer header="Policies" isLoading={isLoading} className="bts-marginBxxl">
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
