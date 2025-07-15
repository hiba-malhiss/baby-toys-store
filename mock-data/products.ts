import { Product } from '../apps/store-admin/src/types/product.types';

const PRODUCTS_KEY = 'products';

const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Plush Elephant',
    price: 15.99,
    published: true,
    createdAt: new Date().toISOString(),
    stock: {
      inStock: 100,
      reserved: 10,
      sold: 25,
    },
  },
  {
    id: '2',
    name: 'Wooden Blocks',
    price: 24.99,
    published: true,
    createdAt: new Date().toISOString(),
    stock: {
      inStock: 50,
      reserved: 5,
      sold: 15,
    },
  },
  {
    id: '3',
    name: 'Toy Car',
    price: 9.99,
    published: false,
    createdAt: new Date().toISOString(),
    stock: {
      inStock: 200,
      reserved: 20,
      sold: 50,
    },
  },
];

const getProductsFromStorage = (): Product[] => {
  const data = localStorage.getItem(PRODUCTS_KEY);
  if (data) {
    return JSON.parse(data);
  } else {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(initialProducts));
    return initialProducts;
  }
};

const saveProductsToStorage = (products: Product[]) => {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
};

export const useMockAdminApi = () => {
  const getProducts = async (): Promise<Product[]> => {
    return getProductsFromStorage();
  };

  const getProduct = async (id: string): Promise<Product | undefined> => {
    const products = getProductsFromStorage();
    return products.find((p) => p.id === id);
  };

  const addProduct = async (product: Product): Promise<Product> => {
    const products = getProductsFromStorage();
    const newProduct = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    saveProductsToStorage([...products, newProduct]);
    return newProduct;
  };

  const updateProduct = async (id: string, product: Product): Promise<Product> => {
    const products = getProductsFromStorage();
    const updatedProducts = products.map((p) => (p.id === id ? { ...p, ...product } : p));
    saveProductsToStorage(updatedProducts);
    return product;
  };

  const deleteProduct = async (id: string): Promise<void> => {
    const products = getProductsFromStorage();
    const updatedProducts = products.filter((p) => p.id !== id);
    saveProductsToStorage(updatedProducts);
  };

  const deleteProducts = async (ids: string[]): Promise<void> => {
    const products = getProductsFromStorage();
    const updatedProducts = products.filter((p) => !ids.includes(p.id));
    saveProductsToStorage(updatedProducts);
  };

  return {
    getProducts,
    getProduct,
    addProduct,
    updateProduct,
    deleteProduct,
    deleteProducts,
  };
};
