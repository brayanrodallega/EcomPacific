import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Config } from '@config/configuracion';
import { UsuariosService } from '@modules/usuarios/services/usuarios.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { JwtPayload, TokenPair, AuthTokens } from '../interfaces/jwt-payload.interface';
import { UserRole } from '@modules/usuarios/entities/user.entity';

@Injectable()
export class AutenticacionService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<AuthTokens> {
    const user = await this.usuariosService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await this.usuariosService.validatePassword(user, loginDto.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const tokens = await this.generateTokens(user);
    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        rol: user.rol,
      },
    };
  }

  async register(registerDto: RegisterDto): Promise<AuthTokens> {
    const user = await this.usuariosService.create({
      ...registerDto,
      rol: registerDto.rol || UserRole.CLIENTE,
    });

    const tokens = await this.generateTokens(user);
    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        rol: user.rol,
      },
    };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<TokenPair> {
    try {
      const payload = this.jwtService.verify(refreshTokenDto.refreshToken, {
        secret: Config.jwt.refreshSecret,
      });

      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Token de refresco inválido');
      }

      const user = await this.usuariosService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('Usuario no encontrado');
      }

      return this.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException('Token de refresco inválido o expirado');
    }
  }

  private async generateTokens(user: any): Promise<TokenPair> {
    const payload: JwtPayload = {
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
}