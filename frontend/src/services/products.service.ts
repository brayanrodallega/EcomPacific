import type { ApiFailure, ApiSuccess, Product } from '../types/product';

const apiUrl = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '');
const productsUrl = apiUrl ? `${apiUrl}/productos` : '/api/productos';

export async function getProducts(signal?: AbortSignal): Promise<Product[]> {
  let response: Response;
  try {
    response = await fetch(productsUrl, { signal, headers: { Accept: 'application/json' } });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error;
    throw new Error('No se pudo conectar con el servidor. Comprueba que el backend esté disponible.');
  }

  const payload = (await response.json().catch(() => null)) as ApiSuccess<Product[]> | ApiFailure | null;
  if (!response.ok) {
    const message = payload && 'message' in payload ? payload.message : undefined;
    throw new Error(Array.isArray(message) ? message.join(', ') : message || `La API respondió con error ${response.status}.`);
  }
  if (!payload || !('data' in payload) || !Array.isArray(payload.data)) {
    throw new Error('La respuesta del backend no tiene el formato esperado para el catálogo.');
  }
  return payload.data;
}
