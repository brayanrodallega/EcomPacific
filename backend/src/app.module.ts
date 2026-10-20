import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Config } from '@config/configuracion';
import { DatabaseModule } from '@modules/compartido/database.module';
import { CompartidoModule } from '@modules/compartido/compartido.module';
import { UsuariosModule } from '@modules/usuarios/usuarios.module';
import { AutenticacionModule } from '@modules/autenticacion/autenticacion.module';
import { ProductosModule } from '@modules/productos/productos.module';
import { CategoriasModule } from '@modules/categorias/categorias.module';
import { OrdenesModule } from '@modules/ordenes/ordenes.module';
import { CarritoModule } from '@modules/carrito/carrito.module';
import { LoggerMiddleware } from '@middlewares/logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
      secret: Config.jwt.secret,
      signOptions: { expiresIn: Config.jwt.expiresIn },
    }),
    DatabaseModule,
    CompartidoModule,
    UsuariosModule,
    AutenticacionModule,
    ProductosModule,
    CategoriasModule,
    OrdenesModule,
    CarritoModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}