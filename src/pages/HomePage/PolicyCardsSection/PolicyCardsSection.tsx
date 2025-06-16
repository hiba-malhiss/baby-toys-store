import Flex from '../../../components/common/Flex/Flex.tsx';
import { infoCards } from '../../../mock-data/home-page.ts';
import InfoCard from '../../../components/common/InfoCard/InfoCard.tsx';

const PolicyCardsSection = () => {
  return (
    <Flex spacing="xxl" align="center" fullWidth justify="center" wrap>
      {infoCards.map((card, index) => (
        <InfoCard key={index} card={card} />
      ))}
    </Flex>
  );
};

export default PolicyCardsSection;
