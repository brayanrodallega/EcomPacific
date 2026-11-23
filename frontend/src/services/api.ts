const configuredApiUrl = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '');

export function getApiBaseUrl(): string {
  if (configuredApiUrl) return configuredApiUrl;
  if (import.meta.env.DEV) return '/api';
  throw new Error('Configura VITE_API_URL con la URL pública del backend.');
}
