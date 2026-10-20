import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { UsuarioRepository } from './repositories/usuario.repository';
import { UsuariosService } from './services/usuarios.service';
import { UsuariosController } from './controllers/usuarios.controller';

@Module({
  imports: [SequelizeModule.forFeature([User])],
  controllers: [UsuariosController],
  providers: [UsuariosService, UsuarioRepository],
  exports: [UsuariosService, UsuarioRepository],
})
export class UsuariosModule {}