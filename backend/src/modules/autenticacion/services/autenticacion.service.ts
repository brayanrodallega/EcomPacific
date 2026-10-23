import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Config } from '@config/configuracion';
import { UserRepository } from '../repositories/user.repository';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { JwtPayload, TokenPair, AuthTokens } from '../interfaces/jwt-payload.interface';
import { UserRole } from '../entities/user.entity';

@Injectable()
export class AutenticacionService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async iniciarSesion(loginDto: LoginDto): Promise<any> {
    const usuario = await this.userRepository.findByEmail(loginDto.email);
    
    if (!usuario) {
      await this.simularVerificacionPassword();
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (!(await this.verificarBloqueo(usuario))) {
      throw new UnauthorizedException('Cuenta bloqueada temporalmente. Intente más tarde.');
    }

    const esValida = await bcrypt.compare(loginDto.password, usuario.password);
    
    if (!esValida) {
      await this.registrarIntentoFallido(usuario);
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (!usuario.activo) {
      throw new UnauthorizedException('Cuenta desactivada');
    }

    await this.userRepository.resetLoginAttempts(usuario.id);

    const tokens = await this.generarTokens(usuario);
    
    await this.userRepository.updateRefreshToken(usuario.id, tokens.refreshToken);

    return {
      ...tokens,
      usuario: {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        rol: usuario.rol,
      },
    };
  }

  async registrar(registerDto: RegisterDto): Promise<any> {
    const existing = await this.userRepository.findByEmail(registerDto.email);
    if (existing) {
      throw new ConflictException('El email ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, Config.bcrypt.rounds);

    const user = await this.userRepository.create({
      ...registerDto,
      password: hashedPassword,
      rol: registerDto.rol || UserRole.CLIENTE,
    });

    const tokens = await this.generarTokens(user);
    
    await this.userRepository.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      ...tokens,
      usuario: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        rol: user.rol,
      },
    };
  }

  async renovarToken(refreshTokenDto: RefreshTokenDto): Promise<any> {
    try {
      const payload = this.jwtService.verify(refreshTokenDto.refreshToken, {
        secret: Config.jwt.refreshSecret,
      });

      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Token de refresco inválido');
      }

      const user = await this.userRepository.findById(payload.sub);
      if (!user || user.refreshToken !== refreshTokenDto.refreshToken) {
        throw new UnauthorizedException('Token de refresco inválido');
      }

      if (!user.activo) {
        throw new UnauthorizedException('Cuenta desactivada');
      }

      const tokens = await this.generarTokens(user);
      
      await this.userRepository.updateRefreshToken(user.id, tokens.refreshToken);

      return tokens;
    } catch (error) {
      throw new UnauthorizedException('Token de refresco inválido o expirado');
    }
  }

  async cerrarSesion(userId: number): Promise<void> {
    await this.userRepository.updateRefreshToken(userId, null);
  }

  async obtenerPerfil(userId: number): Promise<any> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }
    return {
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      rol: user.rol,
    };
  }

  private async generarTokens(user: any): Promise<TokenPair> {
    const payload = {
      sub: user.id,
      email: user.email,
      rol: user.rol,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: Config.jwt.secret,
      expiresIn: Config.jwt.expiresIn,
    });

    const refreshToken = this.jwtService.sign(
      { ...payload, type: 'refresh' },
      {
        secret: Config.jwt.refreshSecret,
        expiresIn: Config.jwt.refreshExpiresIn,
      },
    );

    return { accessToken, refreshToken };
  }

  private async verificarBloqueo(user: any): Promise<boolean> {
    if (user.bloqueadoHasta && new Date(user.bloqueadoHasta) > new Date()) {
      return false;
    }
    return true;
  }

  private async registrarIntentoFallido(user: any): Promise<void> {
    const intentos = (user.intentosLogin || 0) + 1;
    
    if (intentos >= 5) {
      const bloqueadoHasta = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos
      await this.userRepository.update(user.id, {
        intentosLogin: intentos,
        ultimoLoginFallido: new Date(),
        bloqueadoHasta: bloqueadoHasta,
      });
    } else {
      await this.userRepository.incrementLoginAttempts(user.id);
      await this.userRepository.update(user.id, {
        ultimoLoginFallido: new Date(),
      });
    }
  }

  private async simularVerificacionPassword(): Promise<void> {
    await bcrypt.compare('dummy', '$2b$10$dummyhashdummyhashdummyhashdummyhash');
  }

  async crearAdminInicial(): Promise<void> {
    const existing = await this.userRepository.findByRole(UserRole.ADMIN);
    if (existing && existing.length > 0) {
      return; // Ya existe un admin
    }

    const hashedPassword = await bcrypt.hash('Admin123!', Config.bcrypt.rounds);
    
    await this.userRepository.create({
      email: 'admin@ecompacific.com',
      password: hashedPassword,
      nombre: 'Administrador',
      rol: UserRole.ADMIN,
      activo: true,
    });
  }
}