import { useState, useEffect } from 'react';
import { Flex, InfoCard } from '@baby-toys/ui-kit';
import { useMockProductsApi } from '@mock-data/useMockApi';
import type { InfoCardType } from '../../../types/product.types.ts';

const PolicyCardsSection = () => {
  const [infoCards, setInfoCards] = useState<InfoCardType[]>([]);
  const [loading, setLoading] = useState(true);
  const { getHomepageContent } = useMockProductsApi(10);

  useEffect(() => {
    getHomepageContent()
      .then(({ infoCards }) => {
        setInfoCards(infoCards);
      })
      .catch((error) => {
        console.error('Error fetching info cards:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [getHomepageContent]);

  if (loading) {
    return null;
  }

  return (
    <Flex spacing="xxl" align="center" fullWidth justify="center" isResponsive>
      {infoCards.map((card, index) => (
        <InfoCard key={index} card={card} fullWidth />
      ))}
    </Flex>
  );
};

export default PolicyCardsSection;
