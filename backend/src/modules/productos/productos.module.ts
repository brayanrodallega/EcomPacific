import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Product } from './entities/product.entity';
import { ProductoRepository } from './repositories/producto.repository';
import { ProductosController } from './controllers/productos.controller';
import { ProductosService } from './services/productos.service';

@Module({
  imports: [SequelizeModule.forFeature([Product])],
  controllers: [ProductosController],
  providers: [ProductosService, ProductoRepository],
  exports: [ProductosService, ProductoRepository],
})
export class ProductosModule {}