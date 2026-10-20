import { Injectable, Inject } from '@nestjs/common';
import { getModelToken } from '@nestjs/sequelize';
import { Product } from '../entities/product.entity';
import { Op } from 'sequelize';

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

  async findByIds(ids: number[]): Promise<Product[]> {
    return this.productModel.findAll({
      where: {
        id: { [Op.in]: ids },
        activo: true,
      },
    });
  }

  async findByCategory(categoriaId: number): Promise<Product[]> {
    return this.productModel.findAll({
      where: {
        categoriaId,
        activo: true,
      },
      order: [['nombre', 'ASC']],
    });
  }

  async create(data: Partial<Product>): Promise<Product> {
    return this.productModel.create(data as any);
  }

  async update(id: number, data: Partial<Product>): Promise<Product | null> {
    const product = await this.findById(id);
    if (!product) return null;
    return product.update(data);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.productModel.destroy({ where: { id } });
    return result > 0;
  }

  async updateStock(id: number, cantidad: number): Promise<Product | null> {
    const product = await this.findById(id);
    if (!product) return null;
    const nuevoStock = Math.max(0, product.stock + cantidad);
    return product.update({ stock: nuevoStock });
  }
}