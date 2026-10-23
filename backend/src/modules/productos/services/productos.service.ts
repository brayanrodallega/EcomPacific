import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/sequelize';
import { ProductoRepository } from '../repositories/producto.repository';
import { CreateProductoDto } from '../dto/create-producto.dto';
import { ProductoResponseDto } from '../dto/producto-response.dto';
import { Product } from '../entities/product.entity';
import { Category } from '@modules/categorias/entities/category.entity';

@Injectable()
export class ProductosService {
  constructor(
    private readonly productoRepository: ProductoRepository,
    @Inject(getModelToken(Category))
    private readonly categoryModel: typeof Category,
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

  async crear(createProductoDto: CreateProductoDto): Promise<any> {
    const categoria = await this.categoryModel.findByPk(createProductoDto.categoriaId);
    if (!categoria) {
      throw new BadRequestException({
        message: 'Datos de entrada inválidos',
        errors: {
          categoriaId: [
            `La categoría con ID ${createProductoDto.categoriaId} no existe`,
          ],
        },
      });
    }

    const producto = await this.productoRepository.create({
      nombre: createProductoDto.nombre,
      descripcion: createProductoDto.descripcion,
      precio: createProductoDto.precio,
      stock: createProductoDto.stock,
      imagenUrl: createProductoDto.imagenUrl,
      categoriaId: createProductoDto.categoriaId,
      activo: createProductoDto.activo ?? true,
    });

    return {
      id: producto.id,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: Number(producto.precio),
      stock: producto.stock,
      imagenUrl: producto.imagenUrl,
      categoriaId: producto.categoriaId,
      activo: producto.activo,
      disponible: producto.activo && producto.stock > 0,
      creadoEn: producto.creadoEn,
      actualizadoEn: producto.actualizadoEn,
    };
  }
}
