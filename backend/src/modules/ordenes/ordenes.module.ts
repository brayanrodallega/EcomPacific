import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Order } from './entities/orden.entity';
import { OrdenItem } from './entities/orden-item.entity';
import { OrdenesController } from './controllers/ordenes.controller';
import { OrdenesService } from './services/ordenes.service';

@Module({
  imports: [SequelizeModule.forFeature([Order, OrdenItem])],
  controllers: [OrdenesController],
  providers: [OrdenesService],
  exports: [OrdenesService],
})
export class OrdenesModule {}