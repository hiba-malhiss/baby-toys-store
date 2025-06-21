import { useParams } from 'react-router-dom';
import { useBreadcrumb } from '../../context/BreadcrumbContext.tsx';
import { useEffect } from 'react';
import { toys } from '../../mock-data/toy-card-list.ts';

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { setExtraCrumbs } = useBreadcrumb();
  const product = toys.find((toy) => toy.id === id);

  const productName = product?.name;
  const productId = product?.id;

  useEffect(() => {
    setExtraCrumbs([{ label: productName, path: `/product-details/${productId}` }]);
    return () => setExtraCrumbs(null);
  }, [productName, productId, setExtraCrumbs]);

  return <div>Product ID: {id}</div>;
};

export default ProductDetailsPage;
