import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../entities/user.entity';

export class UsuarioPerfilDto {
  @ApiProperty({ example: 1, description: 'Identificador único del usuario' })
  id: number;

  @ApiProperty({ example: 'admin@ecompacific.com', description: 'Correo electrónico' })
  email: string;

  @ApiProperty({ example: 'Administrador', description: 'Nombre completo' })
  nombre: string;

  @ApiProperty({ enum: UserRole, example: UserRole.ADMIN, description: 'Rol asignado al usuario' })
  rol: UserRole;
}

export class LoginResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'JWT Access Token (15m)' })
  accessToken: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'JWT Refresh Token (7d)' })
  refreshToken: string;

  @ApiProperty({ type: UsuarioPerfilDto, description: 'Datos del usuario autenticado' })
  usuario: UsuarioPerfilDto;
}

export class RefreshResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'Nuevo JWT Access Token' })
  accessToken: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'Nuevo JWT Refresh Token' })
  refreshToken: string;
}
