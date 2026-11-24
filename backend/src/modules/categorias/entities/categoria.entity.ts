import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  HasMany,
} from 'sequelize-typescript';
import { Producto } from '@modules/productos/entities/producto.entity';

@Table({
  tableName: 'categorias',
  timestamps: false,
})
export class Categoria extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ field: 'id', type: DataType.INTEGER })
  declare id: number;

  @AllowNull(false)
  @Column({ field: 'nombre', type: DataType.STRING(100) })
  declare nombre: string;

  @AllowNull(true)
  @Column({ field: 'descripcion', type: DataType.TEXT })
  declare descripcion: string | null;

  @HasMany(() => Producto, 'idCategoria')
  declare productos?: Producto[];
}
