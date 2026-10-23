import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Config } from '@config/configuracion';
import { TransformResponseInterceptor } from '@core/interceptors/transform-response.interceptor';
import { GlobalExceptionFilter } from '@core/filters/global-exception.filter';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix(Config.apiPrefix);

    app.enableCors({
      origin: Config.cors.origin,
      credentials: true,
    });

    app.useGlobalInterceptors(new TransformResponseInterceptor());
    app.useGlobalFilters(new GlobalExceptionFilter());

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );

    if (Config.swagger.enabled) {
      const config = new DocumentBuilder()
        .setTitle('EcomPacific API')
        .setDescription('API para gestión de tienda online EcomPacific')
        .setVersion('1.0')
        .build();

      const document = SwaggerModule.createDocument(app, config);
      SwaggerModule.setup(Config.swagger.path, app, document);
    }

    await app.listen(Config.port);
    Logger.log(`🚀 EcomPacific API corriendo en puerto ${Config.port}`);
    Logger.log(`📚 Swagger: http://localhost:${Config.port}/${Config.swagger.path}`);
  } catch (error) {
    Logger.error('Error al iniciar la aplicación', error);
    process.exit(1);
  }
}

bootstrap();

process.on('unhandledRejection', (reason) => {
  Logger.error('Unhandled Rejection', reason);
});

process.on('uncaughtException', (error) => {
  Logger.error('Uncaught Exception', error);
  process.exit(1);
});