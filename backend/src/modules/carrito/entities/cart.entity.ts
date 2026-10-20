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
  HasMany,
} from 'sequelize-typescript';
import { User } from '@modules/usuarios/entities/user.entity';
import { CarritoItem } from './carrito-item.entity';

@Table({
  tableName: 'carritos',
  timestamps: true,
  underscored: true,
})
export class Cart extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare usuarioId: number;

  @BelongsTo(() => User)
  declare usuario: User;

  @HasMany(() => CarritoItem)
  declare items: CarritoItem[];

  @CreatedAt
  @Column(DataType.DATE)
  declare creadoEn: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  declare actualizadoEn: Date;
}