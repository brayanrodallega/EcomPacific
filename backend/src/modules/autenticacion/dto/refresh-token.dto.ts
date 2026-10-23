import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  @IsString({ message: 'El refresh token debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El refresh token es obligatorio' })
  refreshToken: string;
}