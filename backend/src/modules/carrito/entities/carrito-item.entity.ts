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
import { Cart } from './cart.entity';
import { Product } from '@modules/productos/entities/product.entity';

@Table({
  tableName: 'carrito_items',
  timestamps: true,
  underscored: true,
})
export class CarritoItem extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @ForeignKey(() => Cart)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare carritoId: number;

  @BelongsTo(() => Cart)
  declare carrito: Cart;

  @ForeignKey(() => Product)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare productoId: number;

  @BelongsTo(() => Product)
  declare producto: Product;

  @AllowNull(false)
  @Default(1)
  @Column(DataType.INTEGER)
  declare cantidad: number;

  @CreatedAt
  @Column(DataType.DATE)
  declare creadoEn: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  declare actualizadoEn: Date;
}