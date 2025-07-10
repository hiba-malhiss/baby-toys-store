import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer/PageContainer.tsx';
import { getPolicies } from '../../mock-data/useMockProductsApi.ts';
import { Heading, AccordionGroup, Accordion } from '@baby-toys/ui-kit/components';

const PoliciesPage: React.FC = () => {
  const [policies, setPolicies] = useState<Record<
    string,
    { title: string; content: string }
  > | null>({});
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedPolicy = searchParams.get('section');

  useEffect(() => {
    getPolicies().then((data) => {
      setPolicies(data);
      setLoading(false);
    });
  }, []);

  const handleAccordionToggle = (key: string) => {
    const current = searchParams.get('section');
    setSearchParams({ section: current === key ? '' : key });
  };

  return (
    <PageContainer header="Policies" isLoading={loading || !policies} className="bts-marginBxxl">
      <AccordionGroup onChange={(key) => handleAccordionToggle(key)}>
        {Object.entries(policies).map(([key, policy]) => (
          <Accordion
            key={key}
            header={<Heading level="h4">{policy.title}</Heading>}
            isOpen={selectedPolicy === key}
            defaultOpen={selectedPolicy === key}
            iconPosition="left"
          >
            {policy.content}
          </Accordion>
        ))}
      </AccordionGroup>
    </PageContainer>
  );
};

export default PoliciesPage;
