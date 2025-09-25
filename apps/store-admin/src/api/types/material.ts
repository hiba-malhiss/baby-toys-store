export interface Material {
  id: number;
  name: string;
  description?: string | null;
}

export interface MaterialCreateDto {
  name: string;
  description?: string | null;
}

export interface MaterialUpdateDto {
  name?: string;
  description?: string | null;
}
