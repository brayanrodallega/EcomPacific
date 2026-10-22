import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { DatabaseModule } from '@modules/compartido/database.module';
import { ProductosModule } from '@modules/productos/productos.module';
import { AutenticacionModule } from '@modules/autenticacion/autenticacion.module';
import { LoggerMiddleware } from '@middlewares/logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minuto
        limit: 5, // 5 intentos por minuto
      },
    ]),
    DatabaseModule,
    ProductosModule,
    AutenticacionModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}