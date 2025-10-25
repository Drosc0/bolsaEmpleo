import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApplicationStatus } from '../entities/application.entity';

// DTO para que un aspirante aplique a una oferta
export class CreateApplicationDto {
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  offerId: number;

  @IsOptional()
  @IsString()
  coverLetter?: string;
}

// DTO para que la empresa actualice el estado de una postulación
export class UpdateApplicationStatusDto {
  @IsNotEmpty()
  @IsEnum(ApplicationStatus)
  status: ApplicationStatus;

  // Opcional: permitir a la empresa añadir una nota interna
  @IsOptional()
  @IsString()
  internalNote?: string;
}
