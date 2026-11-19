require('dotenv').config();
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('3000'),
  API_PREFIX: z.string().default('api'),
  FRONTEND_URL: z.string().url().optional(),

  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.string().transform(Number).default('3306'),
  DB_USER: z.string().default('root'),
  DB_PASSWORD: z.string().default(''),
  DB_NAME: z.string().default('ecompacific'),

  JWT_SECRET: z.string().min(32, 'JWT_SECRET debe tener al menos 32 caracteres'),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET debe tener al menos 32 caracteres'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  BCRYPT_ROUNDS: z.string().transform(Number).default('10'),

  CORS_ORIGIN: z.string().default('*'),

  SWAGGER_ENABLED: z.string().transform(v => v === 'true').default('true'),
  SWAGGER_PATH: z.string().default('docs'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('\n❌ Variables de entorno inválidas:');
  for (const err of parsed.error.errors) {
    console.error(`   ${err.path.join('.')}: ${err.message}`);
  }
  console.error();
  process.exit(1);
}

export const Config = {
  env: parsed.data.NODE_ENV,
  port: parsed.data.PORT,
  apiPrefix: parsed.data.API_PREFIX,
  frontendUrl: parsed.data.FRONTEND_URL,

  db: {
    host: parsed.data.DB_HOST,
    port: parsed.data.DB_PORT,
    user: parsed.data.DB_USER,
    password: parsed.data.DB_PASSWORD,
    name: parsed.data.DB_NAME,
  },

  jwt: {
    secret: parsed.data.JWT_SECRET,
    expiresIn: parsed.data.JWT_EXPIRES_IN,
    refreshSecret: parsed.data.JWT_REFRESH_SECRET,
    refreshExpiresIn: parsed.data.JWT_REFRESH_EXPIRES_IN,
  },

  bcrypt: {
    rounds: parsed.data.BCRYPT_ROUNDS,
  },

  cors: {
    origin: parsed.data.CORS_ORIGIN,
  },

  swagger: {
    enabled: parsed.data.SWAGGER_ENABLED,
    path: parsed.data.SWAGGER_PATH,
  },

  isDevelopment: parsed.data.NODE_ENV === 'development',
  isProduction: parsed.data.NODE_ENV === 'production',
  isTest: parsed.data.NODE_ENV === 'test',
} as const;

export type ConfigType = typeof Config;