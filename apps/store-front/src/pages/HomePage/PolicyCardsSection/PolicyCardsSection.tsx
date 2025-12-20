import { InfoCard } from '@baby-toys/ui-kit';
import { useHomePageContent } from '../../../api/homepageApi';
import type { InfoCardDto } from '../../../api/types/homepage';
import styles from './policy-cards-section.module.scss';

const PolicyCardsSection = () => {
  const { data, isLoading } = useHomePageContent();
  const infoCards = (data?.infoCards ?? []) as InfoCardDto[];

  if (isLoading || !infoCards?.length) {
    return null;
  }

  return (
    <div className={styles.policyCardsSection}>
      {infoCards.map((card, index) => {
        const adapted = {
          appearance: card.appearance,
          iconName: card.icon,
          title: card.title,
          content: card.subtitle,
        } as any;
        return <InfoCard key={card.id ?? index} card={adapted} fullWidth />;
      })}
    </div>
  );
};

export default PolicyCardsSection;
