import { ApiProperty } from '@nestjs/swagger';
import { Producto } from '../entities/producto.entity';

export class ProductoRespuestaDto {
  @ApiProperty({ example: 1, description: 'Identificador único del producto' })
  id: number;

  @ApiProperty({ example: 'Laptop Gaming Pro', description: 'Nombre del producto' })
  nombre: string;

  @ApiProperty({
    example: 'https://ejemplo.com/imagen.jpg',
    required: false,
    nullable: true,
    description: 'URL de la imagen del producto',
  })
  imagenUrl: string | null;

  @ApiProperty({ example: 2500000, description: 'Precio en COP' })
  precio: number;

  @ApiProperty({
    example: true,
    description: 'Indica si el producto está disponible para compra (activo y existencias mayores a 0)',
  })
  disponible: boolean;

  constructor(producto: Producto) {
    this.id = producto.id;
    this.nombre = producto.nombre;
    this.imagenUrl = producto.imagenUrl ?? null;
    this.precio = Number(producto.precio);

    const existenciasTotales = (producto.inventarios || []).reduce(
      (total, inventario) => total + Number(inventario.cantidadDisponible || 0),
      0,
    );

    this.disponible = Boolean(producto.activo) && existenciasTotales > 0;
  }

  static desdeEntidad(producto: Producto): ProductoRespuestaDto {
    return new ProductoRespuestaDto(producto);
  }

  static desdeArreglo(productos: Producto[]): ProductoRespuestaDto[] {
    return productos.map((producto) => new ProductoRespuestaDto(producto));
  }
}
