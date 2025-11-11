import {
  IsEmail,
  IsString,
  IsNotEmpty,
  MinLength,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { UserRole } from '../../user/user.entity';

export class RegisterDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  // El registro inicial debe especificar si es aspirante o empresa
  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;

  // Se hace opcional, ya que solo lo usan las empresas
  @IsOptional()
  @IsString()
  companyName?: string;
}

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
