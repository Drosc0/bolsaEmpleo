import { IsString, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

// DTO para crear el perfil inicial de la empresa
export class CreateCompanyProfileDto {
  @IsNotEmpty()
  @IsString()
  name: string; // Nombre legal o comercial de la empresa

  @IsOptional()
  @IsString()
  description?: string; // Descripción de la empresa

  @IsOptional()
  @IsUrl()
  websiteUrl?: string; // Sitio web oficial

  @IsOptional()
  @IsString()
  address?: string; // Dirección principal o sede
}

// DTO para actualizar el perfil
export class UpdateCompanyProfileDto extends PartialType(
  CreateCompanyProfileDto,
) {
  // Hereda todos los campos como opcionales
}
