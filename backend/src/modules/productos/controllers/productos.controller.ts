import { BadRequestException, Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductosService } from '../services/productos.service';
import { ProductoResponseDto } from '../dto/producto-response.dto';

@ApiTags('Productos')
@Controller('products')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener el catálogo de productos activos' })
  @ApiQuery({
    name: 'categoriaId',
    required: false,
    type: Number,
    description: 'Filtrar por identificador de categoría',
  })
  @ApiResponse({ status: 200, type: [ProductoResponseDto] })
  async findAll(@Query('categoriaId') categoriaId?: string): Promise<ProductoResponseDto[]> {
    if (categoriaId === undefined) return this.productosService.findAll();

    const parsedCategoryId = Number(categoriaId);
    if (!Number.isInteger(parsedCategoryId) || parsedCategoryId < 1) {
      throw new BadRequestException('categoriaId debe ser un entero positivo');
    }

    return this.productosService.findByCategory(parsedCategoryId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un producto activo por identificador' })
  @ApiResponse({ status: 200, type: ProductoResponseDto })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  async findById(@Param('id', ParseIntPipe) id: number): Promise<ProductoResponseDto> {
    return this.productosService.findById(id);
  }
}
