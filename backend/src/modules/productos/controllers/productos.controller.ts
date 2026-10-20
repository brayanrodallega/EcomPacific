import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { ProductosService } from '../services/productos.service';
import { ProductoResponseDto } from '../dto/producto-response.dto';

@ApiTags('Productos')
@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener catálogo de productos activos' })
  @ApiQuery({ name: 'categoriaId', required: false, type: Number, description: 'Filtrar por categoría' })
  @ApiResponse({ status: 200, description: 'Lista de productos', type: [ProductoResponseDto] })
  async findAll(@Query('categoriaId') categoriaId?: number): Promise<ProductoResponseDto[]> {
    if (categoriaId) {
      return this.productosService.findByCategory(categoriaId);
    }
    return this.productosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener producto por ID' })
  @ApiResponse({ status: 200, description: 'Producto encontrado', type: ProductoResponseDto })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  async findById(@Param('id', ParseIntPipe) id: number): Promise<ProductoResponseDto> {
    return this.productosService.findById(id);
  }
}