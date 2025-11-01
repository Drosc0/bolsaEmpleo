import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { SkillLevel } from '../entities/skill-item.entity'; // Asegúrate de que la ruta sea correcta
import { PartialType } from '@nestjs/mapped-types';

// DTO para crear una nueva habilidad (todos los campos son requeridos)
export class CreateSkillItemDto {
  @IsNotEmpty()
  @IsString()
  skillName: string;

  @IsNotEmpty()
  @IsEnum(SkillLevel, {
    message: `El nivel debe ser uno de: ${Object.values(SkillLevel).join(', ')}`,
  })
  level: SkillLevel;
}

// DTO para actualizar una habilidad (todos los campos son opcionales)
// Usamos PartialType para heredar y hacer los campos opcionales
export class UpdateSkillItemDto extends PartialType(CreateSkillItemDto) {
  // No necesitamos redefinir nada aquí, PartialType hace todo el trabajo
}
