import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Categorías')
@Controller('categorias')
export class CategoriasController {
  @Get()
  findAll() {
    return { message: 'Categorías - pendiente de implementar' };
  }
}