import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { login } from '../src/services/authService.js';
import { validateLogin } from '../src/utils/loginValidation.js';

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
});

test('valida campos obligatorios, correo y longitud mínima de contraseña', () => {
  assert.deepEqual(validateLogin({ email: '', password: '' }), {
    email: 'Ingresa tu correo electrónico.',
    password: 'Ingresa tu contraseña.',
  });
  assert.equal(validateLogin({ email: 'no-es-correo', password: 'abcdef' }).email,
    'Ingresa un correo electrónico válido.');
  assert.equal(validateLogin({ email: 'a@b.co', password: '123' }).password,
    'La contraseña debe tener al menos 6 caracteres.');
  assert.deepEqual(validateLogin({ email: 'cliente@ejemplo.com', password: 'secreto123' }), {});
});

test('envía credenciales y extrae la respuesta estándar de NestJS', async () => {
  globalThis.fetch = async (url, options) => {
    assert.equal(url, 'http://localhost:3000/api/auth/login');
    assert.equal(options.method, 'POST');
    assert.equal(options.headers['Content-Type'], 'application/json');
    assert.deepEqual(JSON.parse(options.body), {
      email: 'cliente@ejemplo.com',
      password: 'secreto123',
    });
    return new Response(JSON.stringify({
      success: true,
      data: {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        user: { id: 1, email: 'cliente@ejemplo.com', nombre: 'Cliente', rol: 'CLIENTE' },
      },
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  };

  const result = await login({ email: 'cliente@ejemplo.com', password: 'secreto123' });
  assert.equal(result.accessToken, 'access-token');
  assert.equal(result.user.nombre, 'Cliente');
});

test('no revela si el correo existe cuando el backend responde 401', async () => {
  globalThis.fetch = async () => new Response(JSON.stringify({
    success: false,
    message: 'Credenciales inválidas',
  }), { status: 401, headers: { 'Content-Type': 'application/json' } });

  await assert.rejects(
    login({ email: 'cliente@ejemplo.com', password: 'incorrecta' }),
    { message: 'Correo o contraseña incorrectos.' },
  );
});

test('presenta un mensaje claro cuando el backend falla', async () => {
  globalThis.fetch = async () => new Response('{}', { status: 500 });

  await assert.rejects(
    login({ email: 'cliente@ejemplo.com', password: 'secreto123' }),
    { message: 'Ocurrió un error en el servidor. Inténtalo más tarde.' },
  );
});

test('presenta un mensaje claro cuando el servidor no está disponible', async () => {
  globalThis.fetch = async () => { throw new Error('network down'); };

  await assert.rejects(
    login({ email: 'cliente@ejemplo.com', password: 'secreto123' }),
    { message: 'No fue posible conectar con el servidor. Inténtalo de nuevo.' },
  );
});
