import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Cart } from './entities/cart.entity';
import { CarritoItem } from './entities/carrito-item.entity';
import { CarritoController } from './controllers/carrito.controller';
import { CarritoService } from './services/carrito.service';

@Module({
  imports: [SequelizeModule.forFeature([Cart, CarritoItem])],
  controllers: [CarritoController],
  providers: [CarritoService],
  exports: [CarritoService],
})
export class CarritoModule {}