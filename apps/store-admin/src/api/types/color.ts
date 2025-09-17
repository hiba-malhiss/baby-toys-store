export interface Color {
  id: string;
  name: string;
  code: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateColorRequest {
  name: string;
  code: string;
}

export interface UpdateColorRequest extends Partial<CreateColorRequest> {}
