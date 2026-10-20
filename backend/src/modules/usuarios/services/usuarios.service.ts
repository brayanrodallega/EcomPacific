import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { UsuarioRepository } from '../repositories/usuario.repository';
import { User, UserRole } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Config } from '@config/configuracion';

@Injectable()
export class UsuariosService {
  constructor(
    private readonly usuarioRepository: UsuarioRepository,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usuarioRepository.findAll();
  }

  async findById(id: number): Promise<User> {
    const user = await this.usuarioRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usuarioRepository.findByEmail(email);
  }

  async create(data: { email: string; password: string; nombre: string; rol?: UserRole }): Promise<User> {
    const existing = await this.usuarioRepository.findByEmail(data.email);
    if (existing) {
      throw new ConflictException('El email ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(data.password, Config.bcrypt.rounds);

    return this.usuarioRepository.create({
      ...data,
      password: hashedPassword,
      rol: data.rol || UserRole.CLIENTE,
    });
  }

  async update(id: number, data: Partial<User>): Promise<User> {
    const user = await this.findById(id);

    if (data.password) {
      data.password = await bcrypt.hash(data.password, Config.bcrypt.rounds);
    }

    const updated = await this.usuarioRepository.update(id, data);
    if (!updated) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return updated;
  }

  async delete(id: number): Promise<void> {
    const deleted = await this.usuarioRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }
}