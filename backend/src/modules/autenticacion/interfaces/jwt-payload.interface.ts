export interface JwtPayload {
  sub: number;
  email: string;
  rol: string;
  type?: 'access' | 'refresh';
  iat?: number;
  exp?: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    email: string;
    nombre: string;
    rol: string;
  };
}