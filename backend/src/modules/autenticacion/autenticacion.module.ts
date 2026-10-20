import { Module } from '@nestjs/common';
import { AutenticacionController } from './controllers/autenticacion.controller';
import { AutenticacionService } from './services/autenticacion.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsuariosModule } from '@modules/usuarios/usuarios.module';

@Module({
  imports: [UsuariosModule],
  controllers: [AutenticacionController],
  providers: [AutenticacionService, JwtStrategy],
  exports: [AutenticacionService],
})
export class AutenticacionModule {}