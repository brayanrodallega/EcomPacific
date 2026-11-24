import { ApiProperty } from '@nestjs/swagger';
import { Producto } from '../entities/producto.entity';
import { ProductoRespuestaDto } from './producto-respuesta.dto';

export class ProductoDetalleRespuestaDto extends ProductoRespuestaDto {
  @ApiProperty({
    example: 'Teclado switches red con iluminación RGB personalizable',
    description: 'Descripción del producto',
    nullable: true,
  })
  descripcion: string | null;

  @ApiProperty({
    example: 1,
    description: 'Identificador de la categoría',
    nullable: true,
  })
  idCategoria: number | null;

  @ApiProperty({
    example: 'Tecnología',
    description: 'Nombre de la categoría',
    nullable: true,
  })
  categoria: string | null;

  constructor(producto: Producto) {
    super(producto);
    this.descripcion = producto.descripcion ?? null;
    this.idCategoria = producto.idCategoria ?? null;
    this.categoria = producto.categoria?.nombre ?? null;
  }

  static desdeEntidad(producto: Producto): ProductoDetalleRespuestaDto {
    return new ProductoDetalleRespuestaDto(producto);
  }
}
