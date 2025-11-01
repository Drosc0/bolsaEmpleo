import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  IsDateString,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

// DTO para crear el perfil inicial
export class CreateAspirantProfileDto {
  @IsNotEmpty()
  @IsString()
  firstName: string; // Nombre

  @IsNotEmpty()
  @IsString()
  lastName: string; // Apellido

  @IsOptional()
  @IsString()
  phone?: string; // Teléfono

  @IsOptional()
  @IsString()
  address?: string; // Dirección o Ciudad

  @IsOptional()
  @IsUrl()
  linkedinUrl?: string; // URL de LinkedIn

  @IsOptional()
  @IsUrl()
  portfolioUrl?: string; // URL de Portafolio

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string; // Fecha de Nacimiento
}

// DTO para actualizar el perfil
export class UpdateAspirantProfileDto extends PartialType(
  CreateAspirantProfileDto,
) {
  // Hereda todos los campos como opcionales
}
