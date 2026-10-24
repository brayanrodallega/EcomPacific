import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';
import { ThrottlerGuard, Throttle } from '@nestjs/throttler';
import { AutenticacionService } from '../services/autenticacion.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { LoginResponseDto, RefreshResponseDto, UsuarioPerfilDto } from '../dto/auth-response.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { Public } from '../decorators/public.decorator';

@ApiTags('Autenticación')
@Controller('auth')
export class AutenticacionController {
  constructor(private readonly autenticacionService: AutenticacionService) {}

  @Post('login')
  @Public()
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Sesión iniciada exitosamente', type: LoginResponseDto })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos (errores por campo corregible)' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas o cuenta bloqueada' })
  @ApiResponse({ status: 429, description: 'Demasiadas solicitudes - Límite de intentos excedido' })
  async login(@Body() loginDto: LoginDto) {
    return this.autenticacionService.iniciarSesion(loginDto);
  }

  @Post('register')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Registrar nuevo usuario' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 200, description: 'Usuario registrado exitosamente', type: LoginResponseDto })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos (errores por campo corregible)' })
  @ApiResponse({ status: 409, description: 'El correo electrónico ya se encuentra registrado' })
  async register(@Body() registerDto: RegisterDto) {
    return this.autenticacionService.registrar(registerDto);
  }

  @Post('refresh')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Renovar access token' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({ status: 200, description: 'Tokens renovados exitosamente', type: RefreshResponseDto })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 401, description: 'Token de refresco inválido o expirado' })
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.autenticacionService.renovarToken(refreshTokenDto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cerrar sesión' })
  @ApiResponse({ status: 200, description: 'Sesión cerrada exitosamente' })
  @ApiResponse({ status: 401, description: 'No autenticado - Token JWT inválido o ausente' })
  async logout(@CurrentUser('sub') userId: number) {
    await this.autenticacionService.cerrarSesion(userId);
    return { message: 'Sesión cerrada correctamente' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener usuario actual' })
  @ApiResponse({ status: 200, description: 'Perfil de usuario obtenido correctamente', type: UsuarioPerfilDto })
  @ApiResponse({ status: 401, description: 'No autenticado - Token JWT inválido o ausente' })
  async me(@CurrentUser('sub') userId: number) {
    return this.autenticacionService.obtenerPerfil(userId);
  }
}