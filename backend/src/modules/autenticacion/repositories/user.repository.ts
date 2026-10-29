import { Injectable, Inject } from '@nestjs/common';
import { getModelToken } from '@nestjs/sequelize';
import { User, UserRole } from '../entities/user.entity';
import { Op } from 'sequelize';

@Injectable()
export class UserRepository {
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

  async findByEmailOrUsername(email: string): Promise<User | null> {
    return this.userModel.findOne({ where: { email } });
  }

  async findByRole(rol: UserRole): Promise<User[]> {
    return this.userModel.findAll({ where: { rol } });
  }

  async findActiveById(id: number): Promise<User | null> {
    return this.userModel.findOne({ where: { id, activo: true } });
  }

  async findActiveByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ where: { email, activo: true } });
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

  async deactivate(id: number): Promise<User | null> {
    const user = await this.findById(id);
    if (!user) return null;
    return user.update({ activo: false });
  }

  async activate(id: number): Promise<User | null> {
    const user = await this.findById(id);
    if (!user) return null;
    return user.update({ activo: true });
  }

  async changeRole(id: number, rol: UserRole): Promise<User | null> {
    const user = await this.findById(id);
    if (!user) return null;
    return user.update({ rol });
  }

  async findByRefreshToken(refreshToken: string): Promise<User | null> {
    return this.userModel.findOne({ where: { refreshToken } });
  }

  async updateRefreshToken(id: number, refreshToken: string | null): Promise<User | null> {
    const user = await this.findById(id);
    if (!user) return null;
    return user.update({ refreshToken });
  }

  async incrementLoginAttempts(id: number): Promise<User | null> {
    const user = await this.findById(id);
    if (!user) return null;
    return user.increment('intentosLogin');
  }

  async resetLoginAttempts(id: number): Promise<User | null> {
    const user = await this.findById(id);
    if (!user) return null;
    return user.update({
      intentosLogin: 0,
      ultimoLoginFallido: null,
      bloqueadoHasta: null,
    });
  }

  async setLockout(id: number): Promise<User | null> {
    const user = await this.findById(id);
    if (!user) return null;
    const lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos
    return user.update({ bloqueadoHasta: lockUntil });
  }

  async isLocked(id: number): Promise<boolean> {
    const user = await this.findById(id);
    if (!user || !user.bloqueadoHasta) return false;
    return user.bloqueadoHasta > new Date();
  }
}