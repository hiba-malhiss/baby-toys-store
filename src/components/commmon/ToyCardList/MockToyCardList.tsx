import ToyCard from '../ToyCard/ToyCard.tsx';
import { useState } from 'react';

const toyNames = [
  'Blocks shape-sorting Toy',
  'Stitch Medium Soft Toy',
  'Wooden Train Set',
  'Stacking Rings',
  'Puzzle Cubes',
  'Animal Figurines',
  'Toy Car Set',
  'Mini Kitchen Set',
  'Learning Laptop',
];

const getRandom = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

const generateRandomToys = (count = 9) => {
  return Array.from({ length: count }, (_, i) => {
    const basePrice = Math.random() * 30 + 10;
    const price = parseFloat(basePrice.toFixed(2));
    const hasDiscount = Math.random() < 0.5;
    const oldPrice = hasDiscount ? `$${(price + Math.random() * 10 + 5).toFixed(2)}` : undefined;
    const label = oldPrice ? 'SALE' : getRandom([undefined, 'NEW']);

    return {
      label,
      imageSrc: `/assets/images/toys/img${i + 1}.png`,
      name: getRandom(toyNames),
      price: `$${price}`,
      oldPrice,
      rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)), // between 3.5–5.0
      isFavorite: false,
    };
  });
};

const toys = generateRandomToys();

const MockToyCardList = () => {
  const [toysState, setToysState] = useState(toys);

  const toggleFavorite = (index: number) => {
    setToysState((prev) =>
      prev.map((toy, i) => (i === index ? { ...toy, isFavorite: !toy.isFavorite } : toy))
    );
  };

  return (
    <div
      style={{
        display: 'flex',
        rowGap: '60px',
        columnGap: '20px',
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}
    >
      {toysState.map((toy, index) => (
        <ToyCard
          key={index}
          label={toy.label}
          imageSrc={toy.imageSrc}
          name={toy.name}
          price={toy.price}
          oldPrice={toy.oldPrice}
          rating={toy.rating}
          isFavorite={toy.isFavorite}
          onToggleFavorite={() => toggleFavorite(index)}
        />
      ))}
    </div>
  );
};

export default MockToyCardList;
