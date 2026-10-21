const API_BASE_URL = (import.meta.env?.VITE_API_URL || 'http://localhost:3000/api').replace(/\/$/, '');

async function request(path, signal) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { signal });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new Error('No se pudo conectar con el catálogo. Comprueba que el backend esté activo.');
  }

  const result = await response.json().catch(() => null);
  if (!response.ok) {
    if (response.status === 404) throw new Error('No encontramos ese producto.');
    throw new Error('El catálogo no está disponible en este momento. Inténtalo de nuevo.');
  }

  const data = result?.data ?? result;
  if (data == null) throw new Error('El servidor respondió con un formato inesperado.');
  return data;
}

export async function getProducts({ signal } = {}) {
  const data = await request('/products', signal);
  if (!Array.isArray(data)) throw new Error('El servidor respondió con un formato inesperado.');
  return data;
}

export async function getProduct(id, { signal } = {}) {
  return request(`/products/${encodeURIComponent(id)}`, signal);
}
