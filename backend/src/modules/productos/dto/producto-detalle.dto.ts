import { ApiProperty } from '@nestjs/swagger';

export class ProductoDetalleDto {
  @ApiProperty({ example: 1, description: 'Identificador único del producto' })
  id: number;

  @ApiProperty({ example: 'Laptop Gaming', description: 'Nombre del producto' })
  nombre: string;

  @ApiProperty({ example: 'Laptop para gaming de alto rendimiento', description: 'Descripción del producto', nullable: true })
  descripcion: string | null;

  @ApiProperty({ example: 2500000, description: 'Precio en COP' })
  precio: number;

  @ApiProperty({ example: 10, description: 'Stock inicial' })
  stock: number;

  @ApiProperty({ example: 'https://ejemplo.com/imagen.jpg', description: 'URL de la imagen del producto', nullable: true })
  imagenUrl: string | null;

  @ApiProperty({ example: 1, description: 'ID de la categoría' })
  categoriaId: number;

  @ApiProperty({ example: true, description: 'Indica si el producto está activo' })
  activo: boolean;

  @ApiProperty({ example: true, description: 'Indica si el producto está disponible para compra (activo y stock > 0)' })
  disponible: boolean;

  @ApiProperty({ example: '2026-10-23T05:00:00.000Z', description: 'Fecha de creación' })
  creadoEn: Date;

  @ApiProperty({ example: '2026-10-23T05:00:00.000Z', description: 'Fecha de última actualización' })
  actualizadoEn: Date;
}
