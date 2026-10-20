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

  async findByCategory(categoriaId: number): Promise<ProductoResponseDto[]> {
    const products = await this.productoRepository.findByCategory(categoriaId);
    return ProductoResponseDto.fromArray(products);
  }

  async getProductEntity(id: number): Promise<Product> {
    const product = await this.productoRepository.findById(id);
    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    return product;
  }
}