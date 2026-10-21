import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../entities/product.entity';

export class ProductoResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Sofá Pacific' })
  nombre: string;

  @ApiProperty({ example: 'Sofá de tres puestos', nullable: true })
  descripcion: string | null;

  @ApiProperty({ example: 2500000, description: 'Precio en COP' })
  precio: number;

  @ApiProperty({ example: 4, description: 'Unidades disponibles' })
  stock: number;

  @ApiProperty({ example: 'https://ejemplo.com/sofa.jpg', nullable: true })
  imagenUrl: string | null;

  @ApiProperty({ example: true })
  disponible: boolean;

  @ApiProperty({ example: 2 })
  categoriaId: number;

  @ApiProperty({ example: 'Sala', nullable: true })
  categoriaNombre: string | null;

  constructor(product: Product) {
    this.id = product.id;
    this.nombre = product.nombre;
    this.descripcion = product.descripcion;
    this.precio = Number(product.precio);
    this.stock = product.stock;
    this.imagenUrl = product.imagenUrl;
    this.disponible = product.activo && product.stock > 0;
    this.categoriaId = product.categoriaId;
    this.categoriaNombre = product.categoria?.nombre ?? null;
  }

  static fromArray(products: Product[]): ProductoResponseDto[] {
    return products.map((product) => new ProductoResponseDto(product));
  }
}
