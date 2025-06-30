import { useState, useEffect } from 'react';
import Flex from '../../../components/common/Flex/Flex.tsx';
import InfoCard from '../../../components/common/InfoCard/InfoCard.tsx';
import { useMockProductsApi } from '../../../mock-data/useMockProductsApi.ts';
import type { InfoCardType } from '../../../types/product.types.ts';
import { useStoreConfiguration } from '../../../context/StoreConfigurationContext.tsx';

const PolicyCardsSection = () => {
  const [infoCards, setInfoCards] = useState<InfoCardType[]>([]);
  const [loading, setLoading] = useState(true);
  const { getHomepageContent } = useMockProductsApi(10);
  const { currency } = useStoreConfiguration();

  useEffect(() => {
    getHomepageContent(currency?.symbol)
      .then(({ infoCards }) => {
        setInfoCards(infoCards);
      })
      .catch((error) => {
        console.error('Error fetching info cards:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [getHomepageContent, currency?.symbol]);

  if (loading) {
    return null;
  }

  return (
    <Flex spacing="xxl" align="center" fullWidth justify="center" wrap>
      {infoCards.map((card, index) => (
        <InfoCard key={index} card={card} />
      ))}
    </Flex>
  );
};

export default PolicyCardsSection;
