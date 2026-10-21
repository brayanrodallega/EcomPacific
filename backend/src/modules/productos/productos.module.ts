import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Category } from '@modules/categorias/entities/category.entity';
import { Product } from './entities/product.entity';
import { ProductoRepository } from './repositories/producto.repository';
import { ProductosController } from './controllers/productos.controller';
import { ProductosService } from './services/productos.service';

@Module({
  imports: [SequelizeModule.forFeature([Product, Category])],
  controllers: [ProductosController],
  providers: [ProductosService, ProductoRepository],
  exports: [ProductosService],
})
export class ProductosModule {}
