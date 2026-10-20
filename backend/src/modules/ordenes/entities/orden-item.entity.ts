import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  Default,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Order } from './orden.entity';
import { Product } from '@modules/productos/entities/product.entity';

@Table({
  tableName: 'orden_items',
  timestamps: true,
  underscored: true,
})
export class OrdenItem extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @ForeignKey(() => Order)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare ordenId: number;

  @BelongsTo(() => Order)
  declare orden: Order;

  @ForeignKey(() => Product)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare productoId: number;

  @BelongsTo(() => Product)
  declare producto: Product;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare cantidad: number;

  @AllowNull(false)
  @Column(DataType.DECIMAL(10, 2))
  declare precio: number;

  @CreatedAt
  @Column(DataType.DATE)
  declare creadoEn: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  declare actualizadoEn: Date;
}