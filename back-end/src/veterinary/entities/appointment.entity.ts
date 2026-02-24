import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Cat } from '../../colonies/entities/cat.entity';
import { NoteDto } from '../../common/dto/note.dto';

export type AppointmentType = 'neuter' | 'checkup' | 'followup' | 'other';
export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled';

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Cat, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'catId' })
  cat: Cat;

  @Column({ nullable: true })
  catId: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ nullable: true })
  clinic: string;

  @Column({ nullable: true })
  vetName: string;

  @Column({ type: 'varchar', default: 'checkup' })
  type: AppointmentType;

  @Column({ type: 'varchar', default: 'scheduled' })
  status: AppointmentStatus;

  @Column({ type: 'jsonb', default: [] })
  notes: NoteDto[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
