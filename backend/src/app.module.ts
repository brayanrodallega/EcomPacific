import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Config } from '@config/configuracion';
import { DatabaseModule } from '@modules/compartido/database.module';
import { AutenticacionModule } from '@modules/autenticacion/autenticacion.module';
import { UsuariosModule } from '@modules/usuarios/usuarios.module';
import { ProductosModule } from '@modules/productos/productos.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
      global: true,
      secret: Config.jwt.secret,
      signOptions: { expiresIn: Config.jwt.expiresIn },
    }),
    DatabaseModule,
    UsuariosModule,
    AutenticacionModule,
    ProductosModule,
  ],
})
export class AppModule {}
