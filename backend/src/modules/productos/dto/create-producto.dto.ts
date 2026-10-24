import {
  IsBoolean,
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductoDto {
  @ApiProperty({ example: 'Laptop Gaming', description: 'Nombre del producto' })
  @IsDefined({ message: 'El nombre es obligatorio' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MaxLength(255, { message: 'El nombre no puede exceder 255 caracteres' })
  nombre: string;

  @ApiProperty({
    example: 'Laptop para gaming de alto rendimiento',
    description: 'Descripción del producto',
  })
  @IsDefined({ message: 'La descripción es obligatoria' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsNotEmpty({ message: 'La descripción es obligatoria' })
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @MaxLength(2000, { message: 'La descripción no puede exceder 2000 caracteres' })
  descripcion: string;

  @ApiProperty({ example: 2500000, description: 'Precio en COP (debe ser positivo)' })
  @IsDefined({ message: 'El precio es obligatorio' })
  @Type(() => Number)
  @IsNumber({}, { message: 'El precio debe ser un número' })
  @IsPositive({ message: 'El precio debe ser un número positivo' })
  @Max(99999999.99, { message: 'El precio no puede exceder 99,999,999.99' })
  precio: number;

  @ApiProperty({ example: 10, description: 'Stock inicial (entero no negativo)' })
  @IsDefined({ message: 'El stock es obligatorio' })
  @Type(() => Number)
  @IsInt({ message: 'El stock debe ser un número entero' })
  @Min(0, { message: 'El stock no puede ser negativo' })
  stock: number;

  @ApiProperty({
    example: 'https://ejemplo.com/imagen.jpg',
    description: 'URL de la imagen del producto',
  })
  @IsDefined({ message: 'La URL de la imagen es obligatoria' })
  @IsUrl({}, { message: 'La URL de la imagen debe tener un formato válido' })
  @MaxLength(500, { message: 'La URL de la imagen no puede exceder 500 caracteres' })
  imagenUrl: string;

  @ApiProperty({ example: 1, description: 'ID de la categoría existente' })
  @IsDefined({ message: 'La categoría es obligatoria' })
  @Type(() => Number)
  @IsInt({ message: 'El ID de la categoría debe ser un número entero' })
  @IsPositive({ message: 'El ID de la categoría debe ser un número positivo' })
  categoriaId: number;

  @ApiPropertyOptional({
    example: true,
    description: 'Estado del producto (activo/inactivo). Por defecto activo',
  })
  @IsOptional()
  @IsBoolean({ message: 'El estado debe ser un valor booleano' })
  activo?: boolean;
}
