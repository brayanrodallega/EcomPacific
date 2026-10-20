import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Órdenes')
@Controller('ordenes')
export class OrdenesController {
  @Get()
  findAll() {
    return { message: 'Órdenes - pendiente de implementar' };
  }
}