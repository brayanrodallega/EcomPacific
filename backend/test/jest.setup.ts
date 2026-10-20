import 'reflect-metadata';

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET ||= 'ecompacific-test-jwt-secret-32-characters';
process.env.JWT_REFRESH_SECRET ||= 'ecompacific-test-refresh-secret-32-characters';
