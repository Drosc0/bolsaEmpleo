import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';

import { AspirantProfile } from '../../recruitment/aspirants/entities/aspirant-profile.entity';
import { CompanyProfile } from '../../recruitment/companies/entities/company-profile.entity';

export enum UserRole {
  ASPIRANTE = 'aspirante',
  EMPRESA = 'empresa',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, unique: true })
  email: string;

  @Column({ length: 255 })
  password: string; // Hash

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.ASPIRANTE,
  })
  role: UserRole;
  // 1. Relación con Perfil de Aspirante
  @OneToOne(() => AspirantProfile, (profile) => profile.user)
  aspirantProfile: AspirantProfile;

  // 2. Relación con Perfil de Empresa
  @OneToOne(() => CompanyProfile, (profile) => profile.user)
  companyProfile: CompanyProfile;
}
