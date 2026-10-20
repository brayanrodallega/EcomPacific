import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Category } from './entities/category.entity';
import { CategoriasController } from './controllers/categorias.controller';
import { CategoriasService } from './services/categorias.service';

@Module({
  imports: [SequelizeModule.forFeature([Category])],
  controllers: [CategoriasController],
  providers: [CategoriasService],
  exports: [CategoriasService],
})
export class CategoriasModule {}