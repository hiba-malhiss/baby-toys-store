import Flex from '../../../components/layout/Flex/Flex.tsx';
import { infoCards } from '../../../mock-data/home-page.ts';
import InfoCard from '../../../components/commmon/InfoCard/InfoCard.tsx';

const PolicyCardsSection = () => {
  return (
    <Flex spacing="xxl" align="center" fullWidth justify="center">
      {infoCards.map((card, index) => (
        <InfoCard key={index} card={card} />
      ))}
    </Flex>
  );
};

export default PolicyCardsSection;
