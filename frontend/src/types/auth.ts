export interface AuthUser {
  id: number;
  email: string;
  nombre: string;
  rol: string;
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  usuario: AuthUser;
}

export interface ApiEnvelope<T> {
  success: true;
  data: T;
  timestamp: string;
  path: string;
}

export interface ApiError {
  message?: string | string[];
}
