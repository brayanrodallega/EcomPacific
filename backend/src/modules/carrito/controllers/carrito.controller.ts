import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Carrito')
@Controller('carrito')
export class CarritoController {
  @Get()
  findAll() {
    return { message: 'Carrito - pendiente de implementar' };
  }
}