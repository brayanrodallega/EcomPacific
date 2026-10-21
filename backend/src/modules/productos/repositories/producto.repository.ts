import { Injectable, Inject } from '@nestjs/common';
import { getModelToken } from '@nestjs/sequelize';
import { Product } from '../entities/product.entity';

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
}