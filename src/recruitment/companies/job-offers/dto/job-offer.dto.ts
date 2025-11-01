import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

// Si JobOfferStatus es un enum, deberia usar @IsEnum
const JobOfferStatusOptions = ['Abierta', 'Cerrada', 'Pausada'];

export class CreateJobOfferDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  @IsString()
  salaryRange: string;

  // El status se usa si la empresa quiere crearla con un estado diferente a 'Abierta' (por defecto en la entidad)
  @IsOptional()
  @IsString()
  @IsIn(JobOfferStatusOptions)
  status?: string;
}

// se usa PartialType para heredar los validadores y hacer todos los campos opcionales
export class UpdateJobOfferDto extends PartialType(CreateJobOfferDto) {}
