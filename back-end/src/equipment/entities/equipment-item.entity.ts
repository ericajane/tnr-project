import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { NoteDto } from '../../common/dto/note.dto';

export type EquipmentCondition = 'good' | 'fair' | 'poor';

@Entity('equipment_items')
export class EquipmentItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  type: string;

  @Column({ default: 1 })
  quantity: number;

  @Column({ type: 'varchar', default: 'good' })
  condition: EquipmentCondition;

  @Column({ nullable: true })
  location: string;

  @Column({ type: 'jsonb', default: [] })
  notes: NoteDto[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
