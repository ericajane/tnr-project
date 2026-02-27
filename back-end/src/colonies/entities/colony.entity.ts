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
import { Caretaker } from '../../caretakers/entities/caretaker.entity';
import { Cat } from './cat.entity';
import { NoteDto } from '../../common/dto/note.dto';

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

  @ManyToOne(() => Caretaker, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'caretakerId' })
  caretaker: Caretaker;

  @Column({ nullable: true })
  caretakerId: string;

  @OneToMany(() => Cat, (cat) => cat.colony)
  cats: Cat[];

  @Column({ type: 'jsonb', default: [] })
  notes: NoteDto[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
