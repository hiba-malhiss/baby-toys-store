import { Brand, Color, Material, Category, Product } from '@baby-toys/types';

type ReferenceData = {
  brands: Brand[];
  colors: Color[];
  materials: Material[];
  categories: Category[];
};

export const getProductReferences = (product: Product, referenceData: ReferenceData) => {
  const { brands, colors, materials, categories } = referenceData;

  return {
    brand: brands.find((b) => b.id === product.brandId),
    color: colors.find((c) => c.id === product.colorId),
    materials: product.materialIds
      .map((id: string) => materials.find((m) => m.id === id))
      .filter(Boolean),
    category: categories.find((c) => c.id === product.categoryId),
  };
};

export const formatProductReferences = (product: Product, referenceData: ReferenceData) => {
  const refs = getProductReferences(product, referenceData);

  return {
    brand: refs.brand?.name || 'Unknown Brand',
    colors: refs.color?.name || 'N/A',
    materials: refs.materials.map((m: Material) => m.name).join(', ') || 'N/A',
    category: refs.category?.name || 'Uncategorized',
  };
};
