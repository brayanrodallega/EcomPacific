import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductoRepository } from '../repositories/producto.repository';
import { ProductoRespuestaDto } from '../dto/producto-respuesta.dto';

@Injectable()
export class ProductosService {
  constructor(
    private readonly repositorioProducto: ProductoRepository,
  ) {}

  async obtenerTodos(): Promise<ProductoRespuestaDto[]> {
    const productos = await this.repositorioProducto.obtenerTodosActivos();
    return ProductoRespuestaDto.desdeArreglo(productos);
  }

  async buscarPorId(id: number): Promise<ProductoRespuestaDto> {
    const producto = await this.repositorioProducto.buscarPorId(id);
    if (!producto || !producto.activo) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    return ProductoRespuestaDto.desdeEntidad(producto);
  }
}
