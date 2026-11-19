import { Injectable, Inject } from '@nestjs/common';
import { getModelToken } from '@nestjs/sequelize';
import { Producto } from '../entities/producto.entity';
import { Inventario } from '@modules/inventario/entities/inventario.entity';

@Injectable()
export class ProductoRepository {
  constructor(
    @Inject(getModelToken(Producto))
    private readonly modeloProducto: typeof Producto,
  ) {}

  async obtenerTodosActivos(): Promise<Producto[]> {
    return this.modeloProducto.findAll({
      where: {
        activo: true,
      },
      include: [
        {
          model: Inventario,
        },
      ],
      order: [['id', 'DESC']],
    });
  }

  async buscarPorId(id: number): Promise<Producto | null> {
    return this.modeloProducto.findByPk(id, {
      include: [
        {
          model: Inventario,
        },
      ],
    });
  }
}
