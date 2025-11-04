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
import { User } from 'src/user/user.entity';
import { Application } from '../../applications/entities/application.entity';

@Entity('aspirant_profiles')
export class AspirantProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 }) // <-- Añadido 'type: 'varchar'
  firstName: string;

  @Column({ type: 'varchar', length: 100 }) // <-- Añadido 'type: 'varchar'
  lastName: string;

  @Column({ type: 'varchar', length: 100, unique: true }) // <-- Añadido 'type: 'varchar'
  email: string;

  @Column({ type: 'varchar', length: 20 }) // <-- Añadido 'type: 'varchar'
  phone: string;

  @Column({ type: 'text', nullable: true })
  bio: string | null;

  // ✅ CORRECCIÓN CLAVE: Aplicamos 'type: varchar' para solucionar el error 'Object'
  @Column({ type: 'varchar', length: 255, nullable: true })
  linkedinUrl: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  portfolioUrl: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  currentJobTitle: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  photoUrl: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
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
  applications: Application[];
}
