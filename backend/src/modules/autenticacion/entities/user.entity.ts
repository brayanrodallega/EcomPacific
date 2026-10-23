import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  Unique,
  AllowNull,
  Default,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';

export enum UserRole {
  ADMIN = 'ADMIN',
  VENDEDOR = 'VENDEDOR',
  CLIENTE = 'CLIENTE',
}

@Table({
  tableName: 'usuarios',
  timestamps: true,
  underscored: true,
})
export class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING(255))
  declare email: string;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  declare password: string;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  declare nombre: string;

  @AllowNull(false)
  @Default(UserRole.CLIENTE)
  @Column(DataType.ENUM(...Object.values(UserRole)))
  declare rol: UserRole;

  @AllowNull(false)
  @Default(true)
  @Column(DataType.BOOLEAN)
  declare activo: boolean;

  @AllowNull(true)
  @Default(0)
  @Column(DataType.INTEGER)
  declare intentosLogin: number;

  @AllowNull(true)
  @Column(DataType.DATE)
  declare ultimoLoginFallido: Date;

  @AllowNull(true)
  @Column(DataType.DATE)
  declare bloqueadoHasta: Date;

  @AllowNull(true)
  @Column(DataType.TEXT)
  declare refreshToken: string;

  @CreatedAt
  @Column(DataType.DATE)
  declare creadoEn: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  declare actualizadoEn: Date;
}