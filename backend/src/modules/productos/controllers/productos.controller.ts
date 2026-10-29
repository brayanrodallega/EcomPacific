import {
  Controller,
  Get,
  Post,
  Patch,
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
import { CrearProductoDto } from '../dto/crear-producto.dto';
import { ActualizarProductoDto } from '../dto/actualizar-producto.dto';
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

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todos los productos, incluidos los inactivos (solo ADMIN)' })
  @ApiResponse({ status: 200, description: 'Lista completa de productos', type: [ProductoDetalleDto] })
  @ApiResponse({ status: 401, description: 'No autenticado - Token JWT inválido o ausente' })
  @ApiResponse({ status: 403, description: 'No autorizado - Se requiere rol ADMIN' })
  async listarParaAdmin() {
    return this.productosService.listarParaAdmin();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener producto por ID' })
  @ApiResponse({ status: 200, description: 'Producto encontrado', type: ProductoResponseDto })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  async findById(@Param('id', ParseIntPipe) id: number): Promise<ProductoResponseDto> {
    return this.productosService.findById(id);
  }

  @Get(':id/detalle')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener detalle completo de un producto (solo ADMIN)' })
  @ApiResponse({ status: 200, description: 'Detalle del producto', type: ProductoDetalleDto })
  @ApiResponse({ status: 401, description: 'No autenticado - Token JWT inválido o ausente' })
  @ApiResponse({ status: 403, description: 'No autorizado - Se requiere rol ADMIN' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  async obtenerDetalle(@Param('id', ParseIntPipe) id: number) {
    return this.productosService.obtenerDetalle(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear nuevo producto (solo ADMIN)' })
  @ApiBody({ type: CrearProductoDto, description: 'Datos del producto a registrar' })
  @ApiResponse({ status: 201, description: 'Producto creado exitosamente', type: ProductoDetalleDto })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos (errores por campo corregible)' })
  @ApiResponse({ status: 401, description: 'No autenticado - Token JWT inválido o ausente' })
  @ApiResponse({ status: 403, description: 'No autorizado - Se requiere rol ADMIN' })
  async crear(@Body() crearProductoDto: CrearProductoDto) {
    return this.productosService.crear(crearProductoDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar un producto existente (solo ADMIN)' })
  @ApiBody({ type: ActualizarProductoDto, description: 'Campos del producto a modificar (todos opcionales)' })
  @ApiResponse({ status: 200, description: 'Producto actualizado exitosamente', type: ProductoDetalleDto })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos (errores por campo corregible)' })
  @ApiResponse({ status: 401, description: 'No autenticado - Token JWT inválido o ausente' })
  @ApiResponse({ status: 403, description: 'No autorizado - Se requiere rol ADMIN' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  async actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() actualizarProductoDto: ActualizarProductoDto,
  ) {
    return this.productosService.actualizar(id, actualizarProductoDto);
  }
}
