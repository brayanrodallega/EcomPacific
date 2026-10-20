import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Product } from '../entities/product.entity';

export class ProductoResponseDto {
  @ApiProperty({ example: 1, description: 'Identificador único del producto' })
  id: number;

  @ApiProperty({ example: 'Laptop Gaming', description: 'Nombre del producto' })
  nombre: string;

  @ApiProperty({ example: 'Laptop para gaming de alto rendimiento', required: false, description: 'Descripción del producto' })
  descripcion: string | null;

  @ApiProperty({ example: 2500000, description: 'Precio en COP' })
  precio: number;

  @ApiProperty({ example: 10, description: 'Cantidad disponible en inventario' })
  stock: number;

  @ApiProperty({ example: 'https://ejemplo.com/imagen.jpg', required: false, description: 'URL de la imagen del producto' })
  imagenUrl: string | null;

  @ApiProperty({ example: true, description: 'Indica si el producto está disponible para compra' })
  disponible: boolean;

  @ApiProperty({ example: 1, description: 'Identificador de la categoría' })
  categoriaId: number;

  @Exclude()
  activo: boolean;

  @Exclude()
  creadoEn: Date;

  @Exclude()
  actualizadoEn: Date;

  constructor(product: Product) {
    this.id = product.id;
    this.nombre = product.nombre;
    this.descripcion = product.descripcion;
    this.precio = Number(product.precio);
    this.stock = product.stock;
    this.imagenUrl = product.imagenUrl;
    this.disponible = product.activo && product.stock > 0;
    this.categoriaId = product.categoriaId;
  }

  static fromArray(products: Product[]): ProductoResponseDto[] {
    return products.map(p => new ProductoResponseDto(p));
  }
}