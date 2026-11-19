import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  Default,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Producto } from '@modules/productos/entities/producto.entity';

@Table({
  tableName: 'inventario',
  timestamps: false,
})
export class Inventario extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ field: 'idInventario', type: DataType.INTEGER })
  declare id: number;

  @ForeignKey(() => Producto)
  @AllowNull(false)
  @Column({ field: 'idProducto', type: DataType.INTEGER })
  declare idProducto: number;

  @AllowNull(false)
  @Column({ field: 'idAlmacen', type: DataType.INTEGER })
  declare idAlmacen: number;

  @AllowNull(true)
  @Column({ field: 'ubicacionAlmacen', type: DataType.STRING(100) })
  declare ubicacionAlmacen: string | null;

  @AllowNull(false)
  @Default(0)
  @Column({ field: 'cantidadDisponible', type: DataType.INTEGER })
  declare cantidadDisponible: number;

  @AllowNull(false)
  @Default(0)
  @Column({ field: 'stockMinimo', type: DataType.INTEGER })
  declare stockMinimo: number;

  @BelongsTo(() => Producto, 'idProducto')
  declare producto?: Producto;
}
