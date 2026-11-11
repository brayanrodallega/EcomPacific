import type { ApiEnvelope, ApiError, AuthSession } from '../types/auth';
import { getApiBaseUrl } from './api';

const SESSION_KEY = 'ecompacific.session';

export async function login(email: string, password: string): Promise<AuthSession> {
  const loginUrl = `${getApiBaseUrl()}/auth/login`;
  let response: Response;
  try {
    response = await fetch(loginUrl, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
  } catch {
    throw new Error('No se pudo conectar con el servidor. Intenta de nuevo más tarde.');
  }

  const payload = (await response.json().catch(() => null)) as ApiEnvelope<AuthSession> | ApiError | null;
  if (!response.ok) {
    const message = payload && 'message' in payload ? payload.message : undefined;
    throw new Error(Array.isArray(message) ? message.join(', ') : message || 'No fue posible iniciar sesión. Verifica tus datos.');
  }
  if (!payload || !('data' in payload) || !payload.data || !payload.data.accessToken || !payload.data.refreshToken || !payload.data.usuario) {
    throw new Error('La respuesta de autenticación no tiene el formato esperado.');
  }

  return payload.data;
}

export function saveSession(session: AuthSession): void {
  window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function readSession(): AuthSession | null {
  const stored = window.sessionStorage.getItem(SESSION_KEY);
  if (!stored) return null;
  try {
    const value: unknown = JSON.parse(stored);
    if (typeof value === 'object' && value !== null && 'accessToken' in value && 'usuario' in value) {
      const session = value as AuthSession;
      return typeof session.accessToken === 'string' && session.accessToken && session.usuario ? session : null;
    }
    window.sessionStorage.removeItem(SESSION_KEY);
    return null;
  } catch {
    window.sessionStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function clearSession(): void {
  window.sessionStorage.removeItem(SESSION_KEY);
}

export async function logout(accessToken: string): Promise<void> {
  try {
    await fetch(`${getApiBaseUrl()}/auth/logout`, {
      method: 'POST',
      headers: { Accept: 'application/json', Authorization: `Bearer ${accessToken}` },
    });
  } catch {
    // Always end the local session, even when the API cannot be reached.
  } finally {
    clearSession();
  }
}
