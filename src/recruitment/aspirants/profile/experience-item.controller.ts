import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Req,
  Param,
  ParseIntPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';

import { ExperienceItemService } from './experience-item.service';
import {
  CreateExperienceItemDto,
  UpdateExperienceItemDto,
} from '../dto/experience-item.dto';
import { ExperienceItem } from '../entities/experience-item.entity';

// Autenticación y Roles
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/auth/entities/user.entity';

// Interfaz para tipar el objeto de solicitud con el usuario adjunto
interface CustomRequest extends Request {
  user: {
    id: number; // ID del usuario autenticado
    role: UserRole;
  };
}

@Controller('recruitment/aspirants/experience')
@UseGuards(JwtAuthGuard, RolesGuard) // Aplicar guardias
@Roles(UserRole.ASPIRANTE) // Restringir solo a aspirantes
export class ExperienceItemController {
  constructor(private readonly experienceItemService: ExperienceItemService) {}

  // =========================================================================
  // 1. CREAR Y LEER
  // =========================================================================

  /**
   * POST /api/recruitment/aspirants/experience
   * Agrega un nuevo registro de experiencia al perfil del aspirante autenticado.
   */
  @Post()
  create(
    @Req() req: CustomRequest,
    @Body() createExperienceItemDto: CreateExperienceItemDto,
  ): Promise<ExperienceItem> {
    const userId = req.user.id;
    return this.experienceItemService.create(userId, createExperienceItemDto);
  }

  /**
   * GET /api/recruitment/aspirants/experience
   * Obtiene toda la experiencia laboral del aspirante autenticado.
   */
  @Get()
  findAllByAspirant(@Req() req: CustomRequest): Promise<ExperienceItem[]> {
    const userId = req.user.id;
    return this.experienceItemService.findAllByAspirant(userId);
  }

  // =========================================================================
  // 2. ACTUALIZAR Y ELIMINAR
  // =========================================================================

  /**
   * PUT /api/recruitment/aspirants/experience/:id
   * Actualiza un registro de experiencia específico, verificando la propiedad.
   */
  @Put(':id')
  update(
    @Req() req: CustomRequest,
    @Param('id', ParseIntPipe) experienceId: number,
    @Body() updateExperienceItemDto: UpdateExperienceItemDto,
  ): Promise<ExperienceItem> {
    const userId = req.user.id;
    return this.experienceItemService.update(
      userId,
      experienceId,
      updateExperienceItemDto,
    );
  }

  /**
   * DELETE /api/recruitment/aspirants/experience/:id
   * Elimina un registro de experiencia específico, verificando la propiedad.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // Retornar 204 No Content en caso de éxito
  remove(
    @Req() req: CustomRequest,
    @Param('id', ParseIntPipe) experienceId: number,
  ): Promise<void> {
    const userId = req.user.id;
    return this.experienceItemService.remove(userId, experienceId);
  }
}
