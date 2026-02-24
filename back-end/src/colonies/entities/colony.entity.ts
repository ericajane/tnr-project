import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Volunteer } from '../../volunteers/entities/volunteer.entity';
import { Cat } from './cat.entity';

@Entity('colonies')
export class Colony {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  location: string;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  lat: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  lng: number;

  @ManyToOne(() => Volunteer, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'caretakerId' })
  caretaker: Volunteer;

  @Column({ nullable: true })
  caretakerId: string;

  @OneToMany(() => Cat, (cat) => cat.colony)
  cats: Cat[];

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
