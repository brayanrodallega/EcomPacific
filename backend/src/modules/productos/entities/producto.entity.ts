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
  HasMany,
} from 'sequelize-typescript';
import { Inventario } from '@modules/inventario/entities/inventario.entity';
import { Categoria } from '@modules/categorias/entities/categoria.entity';

@Table({
  tableName: 'producto',
  timestamps: false,
})
export class Producto extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ field: 'idProducto', type: DataType.INTEGER })
  declare id: number;

  @AllowNull(false)
  @Column({ field: 'nombre', type: DataType.STRING(150) })
  declare nombre: string;

  @AllowNull(true)
  @Column({ field: 'descripcion', type: DataType.TEXT })
  declare descripcion: string | null;

  @AllowNull(false)
  @Column({ field: 'precio', type: DataType.DECIMAL(10, 2) })
  declare precio: number;

  @AllowNull(true)
  @Column({ field: 'imagenUrl', type: DataType.STRING(500) })
  declare imagenUrl: string | null;

  @AllowNull(true)
  @Column({ field: 'marca', type: DataType.STRING(100) })
  declare marca: string | null;

  @ForeignKey(() => Categoria)
  @AllowNull(true)
  @Column({ field: 'idCategoria', type: DataType.INTEGER })
  declare idCategoria: number | null;

  @BelongsTo(() => Categoria, 'idCategoria')
  declare categoria?: Categoria;

  @AllowNull(false)
  @Default(true)
  @Column({ field: 'activo', type: DataType.BOOLEAN })
  declare activo: boolean;

  @HasMany(() => Inventario, 'idProducto')
  declare inventarios?: Inventario[];
}
