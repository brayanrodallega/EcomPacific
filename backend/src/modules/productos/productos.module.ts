import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Product } from './entities/product.entity';
import { Category } from '@modules/categorias/entities/category.entity';
import { ProductoRepository } from './repositories/producto.repository';
import { ProductosService } from './services/productos.service';
import { ProductosController } from './controllers/productos.controller';

@Module({
  imports: [SequelizeModule.forFeature([Product, Category])],
  controllers: [ProductosController],
  providers: [ProductosService, ProductoRepository],
  exports: [ProductosService, ProductoRepository],
})
export class ProductosModule {}