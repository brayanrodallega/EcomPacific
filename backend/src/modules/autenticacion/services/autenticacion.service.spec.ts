import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from '@modules/usuarios/services/usuarios.service';
import { AutenticacionService } from './autenticacion.service';

jest.mock('bcrypt', () => ({ compare: jest.fn(), hash: jest.fn() }));

describe('AutenticacionService.login', () => {
  let service: AutenticacionService;
  let usuariosService: jest.Mocked<Pick<UsuariosService, 'findByEmail' | 'validatePassword'>>;
  let jwtService: jest.Mocked<Pick<JwtService, 'sign'>>;

  const user = {
    id: 7,
    email: 'cliente@ejemplo.com',
    nombre: 'Cliente',
    rol: 'CLIENTE',
  } as unknown as NonNullable<Awaited<ReturnType<UsuariosService['findByEmail']>>>;

  beforeEach(() => {
    usuariosService = {
      findByEmail: jest.fn(),
      validatePassword: jest.fn(),
    };
    jwtService = { sign: jest.fn() };
    service = new AutenticacionService(
      usuariosService as unknown as UsuariosService,
      jwtService as unknown as JwtService,
    );
  });

  it('devuelve datos del usuario y tokens cuando las credenciales son válidas', async () => {
    usuariosService.findByEmail.mockResolvedValue(user);
    usuariosService.validatePassword.mockResolvedValue(true);
    jwtService.sign.mockReturnValueOnce('access-token').mockReturnValueOnce('refresh-token');

    await expect(
      service.login({ email: user.email, password: 'secreto123' }),
    ).resolves.toEqual({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      user: { id: user.id, email: user.email, nombre: user.nombre, rol: user.rol },
    });
  });

  it('responde con el mismo error si el correo no existe', async () => {
    usuariosService.findByEmail.mockResolvedValue(null);
    const result = service.login({ email: 'noexiste@ejemplo.com', password: 'secreto123' });

    await expect(result).rejects.toBeInstanceOf(UnauthorizedException);
    await expect(result).rejects.toThrow('Credenciales inválidas');
    expect(usuariosService.validatePassword).not.toHaveBeenCalled();
  });

  it('responde con el mismo error si la contraseña no coincide', async () => {
    usuariosService.findByEmail.mockResolvedValue(user);
    usuariosService.validatePassword.mockResolvedValue(false);

    await expect(
      service.login({ email: user.email, password: 'incorrecta' }),
    ).rejects.toThrow('Credenciales inválidas');
  });
});
