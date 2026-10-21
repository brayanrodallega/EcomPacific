import { Inject, Injectable } from '@nestjs/common';
import { getModelToken } from '@nestjs/sequelize';
import { Product } from '../entities/product.entity';
import { Category } from '@modules/categorias/entities/category.entity';

@Injectable()
export class ProductoRepository {
  constructor(
    @Inject(getModelToken(Product))
    private readonly productModel: typeof Product,
  ) {}

  async findAllActive(): Promise<Product[]> {
    return this.productModel.findAll({
      where: { activo: true },
      include: [{ model: Category, attributes: ['id', 'nombre'] }],
      order: [['nombre', 'ASC']],
    });
  }

  async findById(id: number): Promise<Product | null> {
    return this.productModel.findOne({
      where: { id, activo: true },
      include: [{ model: Category, attributes: ['id', 'nombre'] }],
    });
  }

  async findByCategory(categoriaId: number): Promise<Product[]> {
    return this.productModel.findAll({
      where: { categoriaId, activo: true },
      include: [{ model: Category, attributes: ['id', 'nombre'] }],
      order: [['nombre', 'ASC']],
    });
  }
}
