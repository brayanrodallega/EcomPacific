import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { ProductosService } from '../services/productos.service';
import { ProductoResponseDto } from '../dto/producto-response.dto';
import { ProductoDetalleDto } from '../dto/producto-detalle.dto';
import { CreateProductoDto } from '../dto/create-producto.dto';
import { JwtAuthGuard } from '@modules/autenticacion/guards/jwt-auth.guard';
import { RolesGuard } from '@modules/autenticacion/guards/roles.guard';
import { Roles } from '@modules/autenticacion/decorators/roles.decorator';
import { UserRole } from '@modules/autenticacion/entities/user.entity';

@ApiTags('Productos')
@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener catálogo de productos activos' })
  @ApiResponse({ status: 200, description: 'Lista de productos activos', type: [ProductoResponseDto] })
  async findAll(): Promise<ProductoResponseDto[]> {
    return this.productosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener producto por ID' })
  @ApiResponse({ status: 200, description: 'Producto encontrado', type: ProductoResponseDto })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  async findById(@Param('id', ParseIntPipe) id: number): Promise<ProductoResponseDto> {
    return this.productosService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear nuevo producto (solo ADMIN)' })
  @ApiBody({ type: CreateProductoDto, description: 'Datos del producto a registrar' })
  @ApiResponse({ status: 201, description: 'Producto creado exitosamente', type: ProductoDetalleDto })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos (errores por campo corregible)' })
  @ApiResponse({ status: 401, description: 'No autenticado - Token JWT inválido o ausente' })
  @ApiResponse({ status: 403, description: 'No autorizado - Se requiere rol ADMIN' })
  async crear(@Body() createProductoDto: CreateProductoDto) {
    return this.productosService.crear(createProductoDto);
  }
}
