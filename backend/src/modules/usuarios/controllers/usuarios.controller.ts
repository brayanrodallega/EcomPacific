import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsuariosService } from '../services/usuarios.service';
import { User, UserRole } from '../entities/user.entity';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../dto/update-usuario.dto';
import { JwtAuthGuard } from '@core/guards/jwt-auth.guard';
import { RolesGuard } from '@core/guards/roles.guard';
import { Roles } from '@core/decorators/roles.decorator';
import { CurrentUser } from '@core/decorators/current-user.decorator';

@ApiTags('Usuarios')
@Controller('usuarios')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.VENDEDOR)
  @ApiOperation({ summary: 'Listar todos los usuarios' })
  async findAll(): Promise<User[]> {
    return this.usuariosService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.VENDEDOR)
  @ApiOperation({ summary: 'Obtener usuario por ID' })
  async findById(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usuariosService.findById(id);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Crear nuevo usuario (solo ADMIN)' })
  async create(@Body() data: CreateUsuarioDto): Promise<User> {
    return this.usuariosService.create(data);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Actualizar usuario (solo ADMIN)' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateUsuarioDto,
  ): Promise<User> {
    return this.usuariosService.update(id, data);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Eliminar usuario (solo ADMIN)' })
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.usuariosService.delete(id);
  }

  @Get('perfil/me')
  @ApiOperation({ summary: 'Obtener mi perfil' })
  async getProfile(@CurrentUser('sub') userId: number): Promise<User> {
    return this.usuariosService.findById(userId);
  }
}