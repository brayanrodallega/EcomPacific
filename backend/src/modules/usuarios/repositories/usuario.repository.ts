import { Injectable, Inject } from '@nestjs/common';
import { getModelToken } from '@nestjs/sequelize';
import { User, UserRole } from '../entities/user.entity';

@Injectable()
export class UsuarioRepository {
  constructor(
    @Inject(getModelToken(User))
    private readonly userModel: typeof User,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userModel.findAll();
  }

  async findById(id: number): Promise<User | null> {
    return this.userModel.findByPk(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ where: { email } });
  }

  async findByRole(rol: UserRole): Promise<User[]> {
    return this.userModel.findAll({ where: { rol } });
  }

  async create(data: Partial<User>): Promise<User> {
    return this.userModel.create(data as any);
  }

  async update(id: number, data: Partial<User>): Promise<User | null> {
    const user = await this.findById(id);
    if (!user) return null;
    return user.update(data);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.userModel.destroy({ where: { id } });
    return result > 0;
  }
}