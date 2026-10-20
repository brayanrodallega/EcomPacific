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
  HasMany,
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

  @CreatedAt
  @Column(DataType.DATE)
  declare creadoEn: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  declare actualizadoEn: Date;

  toJSON(): Record<string, unknown> {
    const values = super.toJSON() as Record<string, unknown>;
    delete values.password;
    return values;
  }
}
