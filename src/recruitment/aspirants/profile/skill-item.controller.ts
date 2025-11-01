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

import { SkillItemService } from './skill-item.service';
import { CreateSkillItemDto, UpdateSkillItemDto } from '../dto/skill-item.dto';
import { SkillItem } from '../entities/skill-item.entity';

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

@Controller('recruitment/aspirants/skills')
@UseGuards(JwtAuthGuard, RolesGuard) // Aplicar guardias
@Roles(UserRole.ASPIRANTE) // Restringir solo a aspirantes
export class SkillItemController {
  constructor(private readonly skillItemService: SkillItemService) {}

  // =========================================================================
  // CRUD (CREATE & READ)
  // =========================================================================

  /**
   * POST /api/recruitment/aspirants/skills
   * Agrega una nueva habilidad al perfil del aspirante autenticado.
   */
  @Post()
  create(
    @Req() req: CustomRequest,
    @Body() createSkillItemDto: CreateSkillItemDto,
  ): Promise<SkillItem> {
    const userId = req.user.id;
    return this.skillItemService.create(userId, createSkillItemDto);
  }

  /**
   * GET /api/recruitment/aspirants/skills
   * Obtiene todas las habilidades del aspirante autenticado.
   */
  @Get()
  findAllByAspirant(@Req() req: CustomRequest): Promise<SkillItem[]> {
    const userId = req.user.id;
    return this.skillItemService.findAllByAspirant(userId);
  }

  // =========================================================================
  // CRUD (UPDATE & DELETE)
  // =========================================================================

  /**
   * PUT /api/recruitment/aspirants/skills/:id
   * Actualiza una habilidad específica, verificando la propiedad.
   */
  @Put(':id')
  update(
    @Req() req: CustomRequest,
    @Param('id', ParseIntPipe) skillId: number,
    @Body() updateSkillItemDto: UpdateSkillItemDto,
  ): Promise<SkillItem> {
    const userId = req.user.id;
    return this.skillItemService.update(userId, skillId, updateSkillItemDto);
  }

  /**
   * DELETE /api/recruitment/aspirants/skills/:id
   * Elimina una habilidad específica, verificando la propiedad.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // Retornar 204 No Content en caso de éxito
  remove(
    @Req() req: CustomRequest,
    @Param('id', ParseIntPipe) skillId: number,
  ): Promise<void> {
    const userId = req.user.id;
    return this.skillItemService.remove(userId, skillId);
  }
}
