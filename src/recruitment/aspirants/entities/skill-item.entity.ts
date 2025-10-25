import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { AspirantProfile } from './aspirant-profile.entity';

@Entity('skill_items')
export class SkillItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  name: string; // Ej: Flutter, Liderazgo

  @Column({ length: 50 })
  category: string; // Ej: Técnica, Blanda, Idioma

  @Column('int')
  level: number;

  // Relación: Muchas habilidades pertenecen a un solo perfil
  @ManyToOne(() => AspirantProfile, (profile) => profile.skills, {
    onDelete: 'CASCADE',
  })
  profile: AspirantProfile;

  @Column() // Columna para la clave foránea (FK)
  profileId: number;
}
