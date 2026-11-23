import type { ApiFailure, ApiSuccess, Product } from '../types/product';
import { getApiBaseUrl } from './api';

const productsUrl = () => `${getApiBaseUrl()}/productos`;

export class ProductApiError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message);
    this.name = 'ProductApiError';
  }
}

async function parseProductsResponse<T>(response: Response): Promise<T> {
  const payload = (await response.json().catch(() => null)) as ApiSuccess<T> | ApiFailure | null;
  if (!response.ok) {
    const message = payload && 'message' in payload ? payload.message : undefined;
    throw new ProductApiError(Array.isArray(message) ? message.join(', ') : message || `La API respondió con error ${response.status}.`, response.status);
  }
  if (!payload || !('data' in payload)) {
    throw new Error('La respuesta del backend no tiene el formato esperado.');
  }
  return payload.data;
}

async function requestProduct<T>(url: string, signal?: AbortSignal): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, { signal, headers: { Accept: 'application/json' } });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error;
    throw new Error('No se pudo conectar con el servidor. Comprueba que el backend esté disponible.');
  }
  return parseProductsResponse<T>(response);
}

export async function getProducts(signal?: AbortSignal): Promise<Product[]> {
  const products = await requestProduct<Product[]>(productsUrl(), signal);
  if (!Array.isArray(products)) {
    throw new Error('La respuesta del backend no tiene el formato esperado para el catálogo.');
  }
  return products;
}

export async function getProductById(id: number, signal?: AbortSignal): Promise<Product> {
  return requestProduct<Product>(`${productsUrl()}/${encodeURIComponent(String(id))}`, signal);
}
