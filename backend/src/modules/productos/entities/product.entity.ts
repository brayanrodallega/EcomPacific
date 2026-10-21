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
import { Category } from '@modules/categorias/entities/category.entity';

@Table({ tableName: 'productos', timestamps: true, underscored: true })
export class Product extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  declare nombre: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  declare descripcion: string | null;

  @AllowNull(false)
  @Column(DataType.DECIMAL(10, 2))
  declare precio: number | string;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  declare stock: number;

  @AllowNull(true)
  @Column(DataType.STRING(500))
  declare imagenUrl: string | null;

  @AllowNull(false)
  @Default(true)
  @Column(DataType.BOOLEAN)
  declare activo: boolean;

  @ForeignKey(() => Category)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare categoriaId: number;

  @BelongsTo(() => Category)
  declare categoria: Category;

  @CreatedAt
  @Column(DataType.DATE)
  declare creadoEn: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  declare actualizadoEn: Date;
}
