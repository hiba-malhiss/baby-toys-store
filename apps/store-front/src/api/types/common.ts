export interface ApiEnvelope<T> {
  data: T;
  message?: string;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
