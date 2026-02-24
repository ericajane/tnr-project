import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Colony } from './colony.entity';
import { NoteDto } from '../../common/dto/note.dto';

export type CatStatus = 'trapped' | 'neutered' | 'returned' | 'deceased';
export type CatSex = 'male' | 'female' | 'unknown';

@Entity('cats')
export class Cat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name: string;

  @ManyToOne(() => Colony, (colony) => colony.cats, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'colonyId' })
  colony: Colony;

  @Column()
  colonyId: string;

  @Column({ type: 'varchar', default: 'trapped' })
  status: CatStatus;

  @Column({ type: 'date', nullable: true })
  trapDate: string;

  @Column({ type: 'date', nullable: true })
  neuterDate: string;

  @Column({ type: 'varchar', default: 'unknown' })
  sex: CatSex;

  @Column({ nullable: true })
  color: string;

  @Column({ type: 'jsonb', default: [] })
  notes: NoteDto[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
