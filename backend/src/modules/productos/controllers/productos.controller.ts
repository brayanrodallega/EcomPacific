import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProductosService } from '../services/productos.service';
import { ProductoRespuestaDto } from '../dto/producto-respuesta.dto';
import { ProductoDetalleRespuestaDto } from '../dto/producto-detalle-respuesta.dto';

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
  @ApiResponse({
    status: 200,
    description: 'Producto encontrado',
    type: ProductoDetalleRespuestaDto,
  })
  @ApiResponse({ status: 404, description: 'Producto no encontrado o inactivo' })
  async buscarPorId(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ProductoDetalleRespuestaDto> {
    return this.servicioProductos.buscarPorId(id);
  }
}

