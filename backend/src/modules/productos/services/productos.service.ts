import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductoRepository } from '../repositories/producto.repository';
import { ProductoResponseDto } from '../dto/producto-response.dto';

@Injectable()
export class ProductosService {
  constructor(private readonly productoRepository: ProductoRepository) {}

  async findAll(): Promise<ProductoResponseDto[]> {
    return ProductoResponseDto.fromArray(await this.productoRepository.findAllActive());
  }

  async findById(id: number): Promise<ProductoResponseDto> {
    const product = await this.productoRepository.findById(id);
    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    return new ProductoResponseDto(product);
  }

  async findByCategory(categoriaId: number): Promise<ProductoResponseDto[]> {
    return ProductoResponseDto.fromArray(await this.productoRepository.findByCategory(categoriaId));
  }
}
