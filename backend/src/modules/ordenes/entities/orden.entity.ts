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
import { OrdenItem } from './orden-item.entity';

export enum EstadoOrden {
  PENDIENTE = 'PENDIENTE',
  CONFIRMADO = 'CONFIRMADO',
  ENVIADO = 'ENVIADO',
  ENTREGADO = 'ENTREGADO',
  CANCELADO = 'CANCELADO',
}

@Table({
  tableName: 'ordenes',
  timestamps: true,
  underscored: true,
})
export class Order extends Model {
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

  @AllowNull(false)
  @Column(DataType.DECIMAL(10, 2))
  declare total: number;

  @AllowNull(false)
  @Default(EstadoOrden.PENDIENTE)
  @Column(DataType.ENUM(...Object.values(EstadoOrden)))
  declare estado: EstadoOrden;

  @HasMany(() => OrdenItem)
  declare items: OrdenItem[];

  @CreatedAt
  @Column(DataType.DATE)
  declare creadoEn: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  declare actualizadoEn: Date;
}