import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { AspirantProfile } from './aspirant-profile.entity';

@Entity('experience_items')
export class ExperienceItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  title: string;

  @Column({ length: 100 })
  company: string;

  @Column({ length: 100 })
  location: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date', nullable: true }) // Puede ser nulo si es el puesto actual
  endDate: Date | null;

  @Column({ type: 'text' })
  description: string; // Logros y responsabilidades

  // Relación: Muchas experiencias pertenecen a un solo perfil
  @ManyToOne(() => AspirantProfile, (profile) => profile.experience, {
    onDelete: 'CASCADE',
  })
  profile: AspirantProfile;

  @Column() // Columna para la clave foránea (FK)
  profileId: number;
}
