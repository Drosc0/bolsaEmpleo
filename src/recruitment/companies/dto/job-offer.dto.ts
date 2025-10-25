import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';

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

  @IsOptional()
  @IsString()
  @IsIn(['Abierta', 'Cerrada', 'Pausada'])
  status?: string;
}

export class UpdateJobOfferDto extends CreateJobOfferDto {
  // Para la actualización, se hacen todos los campos opcionales
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @String()
  salaryRange?: string;
}
