import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ExperienceItem } from './experience-item.entity';
import { SkillItem } from './skill-item.entity';
import { User } from 'src/auth/entities/user.entity';
import { Application } from '../../applications/entities/application.entity';

@Entity('aspirant_profiles')
export class AspirantProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  firstName: string;

  @Column({ length: 100 })
  lastName: string;

  @Column({ length: 100, unique: true })
  email: string;

  @Column({ length: 20 })
  phone: string;

  @Column({ type: 'text', nullable: true })
  bio: string | null;

  @Column({ length: 255, nullable: true })
  linkedinUrl: string | null;

  @Column({ length: 255, nullable: true })
  portfolioUrl: string | null;

  @Column({ length: 50, nullable: true })
  currentJobTitle: string | null;

  @Column({ length: 255, nullable: true })
  photoUrl: string | null;

  @Column({ length: 255, nullable: true })
  cvUrl: string | null;

  // ===========
  // RELACIONES
  // ===========

  // 1. Relación 1:1 con el Usuario (dueño del perfil)
  @Column({ unique: true })
  userId: number;

  @OneToOne(() => User, (user) => user.aspirantProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  // 2. Relación 1:N con Habilidades
  @OneToMany(() => SkillItem, (skill) => skill.profile, {
    cascade: ['insert', 'update'],
    onDelete: 'CASCADE',
  })
  skills: SkillItem[];

  // 3. Relación 1:N con Experiencia Laboral
  @OneToMany(() => ExperienceItem, (experience) => experience.profile, {
    cascade: ['insert', 'update'],
    onDelete: 'CASCADE',
  })
  experience: ExperienceItem[];

  // 4. Relación 1:N con Postulaciones (CORRECCIÓN CLAVE)
  @OneToMany(() => Application, (application) => application.aspirantProfile)
  applications: Application[]; // Propiedad 'applications' que resuelve el error
}
