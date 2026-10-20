const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(
  /\/$/,
  '',
);

export async function login({ email, password }) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
  } catch {
    throw new Error('No fue posible conectar con el servidor. Inténtalo de nuevo.');
  }

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Correo o contraseña incorrectos.');
    }

    if (response.status === 400) {
      throw new Error('Revisa los datos ingresados e inténtalo de nuevo.');
    }

    throw new Error('Ocurrió un error en el servidor. Inténtalo más tarde.');
  }

  // NestJS envuelve las respuestas exitosas como { success, data, ... }.
  const data = result?.data ?? result;
  if (!data?.accessToken || !data?.refreshToken || !data?.user) {
    throw new Error('El servidor respondió con un formato inesperado.');
  }

  return data;
}
