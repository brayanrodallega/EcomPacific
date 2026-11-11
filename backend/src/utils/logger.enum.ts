export type LogLevel = 'log' | 'error' | 'warn' | 'debug' | 'verbose';

export function obtenerNivelesLog(isDevelopment: boolean): LogLevel[] {
  if (isDevelopment) {
    return ['log', 'error', 'warn', 'debug', 'verbose'];
  }
  return ['error', 'warn'];
}

export const LOG_LEVELS: LogLevel[] = ['log', 'error', 'warn', 'debug', 'verbose'];