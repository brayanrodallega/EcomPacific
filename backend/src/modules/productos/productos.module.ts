import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Producto } from './entities/producto.entity';
import { Inventario } from '@modules/inventario/entities/inventario.entity';
import { Categoria } from '@modules/categorias/entities/categoria.entity';
import { ProductoRepository } from './repositories/producto.repository';
import { ProductosService } from './services/productos.service';
import { ProductosController } from './controllers/productos.controller';

@Module({
  imports: [SequelizeModule.forFeature([Producto, Inventario, Categoria])],
  controllers: [ProductosController],
  providers: [ProductosService, ProductoRepository],
  exports: [ProductosService, ProductoRepository],
})
export class ProductosModule { }
