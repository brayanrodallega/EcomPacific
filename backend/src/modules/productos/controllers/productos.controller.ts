import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProductosService } from '../services/productos.service';
import { ProductoRespuestaDto } from '../dto/producto-respuesta.dto';

@ApiTags('Productos')
@Controller('productos')
export class ProductosController {
  constructor(private readonly servicioProductos: ProductosService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener catálogo de productos activos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de productos activos',
    type: [ProductoRespuestaDto],
  })
  async obtenerTodos(): Promise<ProductoRespuestaDto[]> {
    return this.servicioProductos.obtenerTodos();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener producto por ID' })
  @ApiResponse({ status: 200, description: 'Producto encontrado', type: ProductoRespuestaDto })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  async buscarPorId(@Param('id', ParseIntPipe) id: number): Promise<ProductoRespuestaDto> {
    return this.servicioProductos.buscarPorId(id);
  }
}

