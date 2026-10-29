import { Injectable, Inject } from '@nestjs/common';
import { getModelToken } from '@nestjs/sequelize';
import { Product } from '../entities/product.entity';

export type CamposActualizablesProducto = Partial<
  Pick<
    Product,
    'nombre' | 'descripcion' | 'precio' | 'stock' | 'imagenUrl' | 'categoriaId' | 'activo'
  >
>;

@Injectable()
export class ProductoRepository {
  constructor(
    @Inject(getModelToken(Product))
    private readonly productModel: typeof Product,
  ) {}

  async findAllActive(): Promise<Product[]> {
    return this.productModel.findAll({
      where: {
        activo: true,
      },
      order: [['creadoEn', 'DESC']],
    });
  }

  async findById(id: number): Promise<Product | null> {
    return this.productModel.findByPk(id);
  }

  async findAll(): Promise<Product[]> {
    return this.productModel.findAll({
      order: [['creadoEn', 'DESC']],
    });
  }

  async create(data: {
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number;
    imagenUrl: string;
    categoriaId: number;
    activo: boolean;
  }): Promise<Product> {
    return this.productModel.create(data);
  }

  async actualizar(
    producto: Product,
    cambios: CamposActualizablesProducto,
  ): Promise<Product> {
    return producto.update(cambios);
  }
}
