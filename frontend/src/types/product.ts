export interface Product {
  id: number;
  nombre: string;
  imagenUrl: string | null;
  precio: number;
  disponible: boolean;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
  timestamp: string;
  path: string;
}

export interface ApiFailure {
  success?: false;
  message?: string | string[];
}
