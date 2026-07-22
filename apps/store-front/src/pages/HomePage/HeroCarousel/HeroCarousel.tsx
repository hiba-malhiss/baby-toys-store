import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Gamepad2, ShoppingBag, Sparkles, Star, Tag } from 'lucide-react';
import styles from './hero-carousel.module.scss';

interface CarouselCard {
  id: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  gradient: string;
  link: string;
  external?: boolean;
}

const HeroCarousel = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('common');
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const cards: CarouselCard[] = [
    {
      id: 'best-sellers',
      icon: <Star size={36} />,
      title: t('home.hero.bestSellers', { defaultValue: 'Best Sellers' }),
      subtitle: t('home.hero.bestSellersSub', { defaultValue: 'Most loved by our customers' }),
      gradient: 'linear-gradient(135deg, #ff9a56 0%, #ff6a88 100%)',
      link: '/shop?sortBy=sales',
    },
    {
      id: 'new-arrivals',
      icon: <Sparkles size={36} />,
      title: t('home.hero.newArrivals', { defaultValue: 'New Arrivals' }),
      subtitle: t('home.hero.newArrivalsSub', { defaultValue: 'Fresh picks just landed' }),
      gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
      link: '/shop?sortBy=createdAt',
    },
    {
      id: 'games',
      icon: <Gamepad2 size={44} />,
      title: t('home.hero.playGames', { defaultValue: 'Play & Learn' }),
      subtitle: t('home.hero.playGamesSub', { defaultValue: 'Fun games for your little ones' }),
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      link: '/game/play',
      external: true,
    },
    {
      id: 'shop-all',
      icon: <ShoppingBag size={36} />,
      title: t('home.hero.shopAll', { defaultValue: 'Shop All' }),
      subtitle: t('home.hero.shopAllSub', { defaultValue: 'Browse our full collection' }),
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      link: '/shop',
    },
    {
      id: 'deals',
      icon: <Tag size={36} />,
      title: t('home.hero.deals', { defaultValue: 'Deals' }),
      subtitle: t('home.hero.dealsSub', { defaultValue: 'Great prices, happy kids' }),
      gradient: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
      link: '/shop?sortBy=price_asc',
    },
  ];

  const count = cards.length;

  const startAutoPlay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % count);
    }, 4000);
  }, [count]);

  useEffect(() => {
    startAutoPlay();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startAutoPlay]);

  const handleCardClick = (card: CarouselCard) => {
    if (card.external) {
      window.location.href = card.link;
    } else {
      navigate(card.link);
    }
  };

  const handleDotClick = (index: number) => {
    setActiveIndex(index);
    startAutoPlay();
  };

  const getPosition = (index: number): number => {
    let diff = index - activeIndex;
    if (diff > count / 2) diff -= count;
    if (diff < -count / 2) diff += count;
    return diff;
  };

  return (
    <div className={styles.hero} ref={containerRef}>
      <div className={styles.heroBackground} />

      <div className={styles.carousel}>
        {cards.map((card, index) => {
          const position = getPosition(index);
          const absPos = Math.abs(position);
          const isCenter = position === 0;

          if (absPos > 2) return null;

          const translateX = position * 280;
          const translateZ = -(absPos * 120);
          const rotateY = position * -12;
          const scale = 1 - absPos * 0.15;
          const opacity = 1 - absPos * 0.25;

          return (
            <div
              key={card.id}
              className={`${styles.card} ${isCenter ? styles.cardCenter : ''}`}
              style={{
                transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                opacity,
                zIndex: 10 - absPos,
              }}
              onClick={() => handleCardClick(card)}
            >
              <div className={styles.cardInner} style={{ background: card.gradient }}>
                <div className={styles.cardIcon}>{card.icon}</div>
                <h3 className={styles.cardTitle}>{card.title}</h3>
                <p className={styles.cardSubtitle}>{card.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.dots}>
        {cards.map((card, index) => (
          <button
            key={card.id}
            className={`${styles.dot} ${index === activeIndex ? styles.dotActive : ''}`}
            onClick={() => handleDotClick(index)}
            aria-label={`Go to ${card.title}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
