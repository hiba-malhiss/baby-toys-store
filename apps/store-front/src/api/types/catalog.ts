export interface Brand {
  id: number;
  name: string;
  description?: string;
  logoUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id?: number;
  name: string;
  description?: string;
  imageUrl?: string;
  isMain?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Color {
  id: string;
  name: string;
  code: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Material {
  id: number;
  name: string;
  description?: string | null;
}
