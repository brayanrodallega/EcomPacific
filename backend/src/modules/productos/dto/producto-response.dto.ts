import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Product } from '../entities/product.entity';

export class ProductoResponseDto {
  @ApiProperty({ example: 1, description: 'Identificador único del producto' })
  id: number;

  @ApiProperty({ example: 'Laptop Gaming', description: 'Nombre del producto' })
  nombre: string;

  @ApiProperty({ example: 'https://ejemplo.com/imagen.jpg', required: false, description: 'URL de la imagen del producto' })
  imagenUrl: string | null;

  @ApiProperty({ example: 2500000, description: 'Precio en COP' })
  precio: number;

  @ApiProperty({ example: true, description: 'Indica si el producto está disponible para compra (stock > 0)' })
  disponible: boolean;

  @Exclude()
  descripcion: string | null;

  @Exclude()
  stock: number;

  @Exclude()
  activo: boolean;

  @Exclude()
  creadoEn: Date;

  @Exclude()
  actualizadoEn: Date;

  constructor(product: Product) {
    this.id = product.id;
    this.nombre = product.nombre;
    this.imagenUrl = product.imagenUrl;
    this.precio = Number(product.precio);
    this.disponible = product.activo && product.stock > 0;
  }

  static fromArray(products: Product[]): ProductoResponseDto[] {
    return products.map(p => new ProductoResponseDto(p));
  }
}