import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductoRepository } from '../repositories/producto.repository';
import { ProductoResponseDto } from '../dto/producto-response.dto';
import { Product } from '../entities/product.entity';

@Injectable()
export class ProductosService {
  constructor(
    private readonly productoRepository: ProductoRepository,
  ) {}

  async findAll(): Promise<ProductoResponseDto[]> {
    const products = await this.productoRepository.findAllActive();
    return ProductoResponseDto.fromArray(products);
  }

  async findById(id: number): Promise<ProductoResponseDto> {
    const product = await this.productoRepository.findById(id);
    if (!product || !product.activo) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    return new ProductoResponseDto(product);
  }
}