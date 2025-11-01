import { IsString, IsNotEmpty, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';

// La definición base de la habilidad (tomada de tu profile.dto)
export class BaseSkillItemDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  // Tu entidad SkillItem no tiene 'category', pero lo mantengo aquí por si lo agregas.
  @IsNotEmpty()
  @IsString()
  category: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(5)
  @Type(() => Number)
  level: number;
}

// DTO para Crear una Habilidad (todos los campos son obligatorios)
export class CreateSkillItemDto extends BaseSkillItemDto {}

// DTO para Actualizar una Habilidad (todos los campos son opcionales)
export class UpdateSkillItemDto extends PartialType(BaseSkillItemDto) {
  // Nota: PartialType hace que 'name', 'category', y 'level' sean opcionales.
}
