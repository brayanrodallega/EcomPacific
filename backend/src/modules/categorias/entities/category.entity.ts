import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  CreatedAt,
  UpdatedAt,
  HasMany,
} from 'sequelize-typescript';
import { Product } from '@modules/productos/entities/product.entity';

@Table({ tableName: 'categorias', timestamps: true, underscored: true })
export class Category extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  declare nombre: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  declare descripcion: string | null;

  @HasMany(() => Product)
  declare productos: Product[];

  @CreatedAt
  @Column(DataType.DATE)
  declare creadoEn: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  declare actualizadoEn: Date;
}
