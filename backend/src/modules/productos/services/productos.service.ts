import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/sequelize';
import {
  CamposActualizablesProducto,
  ProductoRepository,
} from '../repositories/producto.repository';
import { ActualizarProductoDto } from '../dto/actualizar-producto.dto';
import { CrearProductoDto } from '../dto/crear-producto.dto';
import { ProductoDetalleDto } from '../dto/producto-detalle.dto';
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

  async crear(crearProductoDto: CrearProductoDto): Promise<ProductoDetalleDto> {
    const categoria = await this.categoryModel.findByPk(crearProductoDto.categoriaId);
    if (!categoria) {
      throw new BadRequestException({
        message: 'Datos de entrada inválidos',
        errors: {
          categoriaId: [
            `La categoría con ID ${crearProductoDto.categoriaId} no existe`,
          ],
        },
      });
    }

    const producto = await this.productoRepository.create({
      nombre: crearProductoDto.nombre,
      descripcion: crearProductoDto.descripcion,
      precio: crearProductoDto.precio,
      stock: crearProductoDto.stock,
      imagenUrl: crearProductoDto.imagenUrl,
      categoriaId: crearProductoDto.categoriaId,
      activo: crearProductoDto.activo ?? true,
    });

    return this.mapearDetalle(producto);
  }

  async actualizar(
    id: number,
    actualizarProductoDto: ActualizarProductoDto,
  ): Promise<ProductoDetalleDto> {
    const producto = await this.productoRepository.findById(id);
    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    if (actualizarProductoDto.categoriaId !== undefined) {
      const categoria = await this.categoryModel.findByPk(
        actualizarProductoDto.categoriaId,
      );
      if (!categoria) {
        throw new BadRequestException({
          message: 'Datos de entrada inválidos',
          errors: {
            categoriaId: [
              `La categoría con ID ${actualizarProductoDto.categoriaId} no existe`,
            ],
          },
        });
      }
    }

    const cambios: CamposActualizablesProducto = {};
    if (actualizarProductoDto.nombre !== undefined) {
      cambios.nombre = actualizarProductoDto.nombre;
    }
    if (actualizarProductoDto.descripcion !== undefined) {
      cambios.descripcion = actualizarProductoDto.descripcion;
    }
    if (actualizarProductoDto.precio !== undefined) {
      cambios.precio = actualizarProductoDto.precio;
    }
    if (actualizarProductoDto.stock !== undefined) {
      cambios.stock = actualizarProductoDto.stock;
    }
    if (actualizarProductoDto.imagenUrl !== undefined) {
      cambios.imagenUrl = actualizarProductoDto.imagenUrl;
    }
    if (actualizarProductoDto.categoriaId !== undefined) {
      cambios.categoriaId = actualizarProductoDto.categoriaId;
    }
    if (actualizarProductoDto.activo !== undefined) {
      cambios.activo = actualizarProductoDto.activo;
    }

    if (Object.keys(cambios).length === 0) {
      throw new BadRequestException('No se enviaron campos para actualizar');
    }

    const productoActualizado = await this.productoRepository.actualizar(
      producto,
      cambios,
    );

    return this.mapearDetalle(productoActualizado);
  }

  async obtenerDetalle(id: number): Promise<ProductoDetalleDto> {
    const producto = await this.productoRepository.findById(id);
    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    return this.mapearDetalle(producto);
  }

  async listarParaAdmin(): Promise<ProductoDetalleDto[]> {
    const productos = await this.productoRepository.findAll();
    return productos.map((producto) => this.mapearDetalle(producto));
  }

  private mapearDetalle(producto: Product): ProductoDetalleDto {
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
