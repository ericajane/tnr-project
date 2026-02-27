import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Caretaker } from './entities/caretaker.entity';
import { Colony } from '../colonies/entities/colony.entity';
import { CreateCaretakerDto } from './dto/create-caretaker.dto';
import { UpdateCaretakerDto } from './dto/update-caretaker.dto';

export type CaretakerWithColonyIds = Caretaker & { colonyIds: string[] };

@Injectable()
export class CaretakersService {
  constructor(
    @InjectRepository(Caretaker)
    private readonly caretakerRepo: Repository<Caretaker>,
    @InjectRepository(Colony)
    private readonly colonyRepo: Repository<Colony>,
  ) {}

  private async attachColonyIds(caretakers: Caretaker[]): Promise<CaretakerWithColonyIds[]> {
    if (caretakers.length === 0) return [];
    const colonies = await this.colonyRepo
      .createQueryBuilder('colony')
      .select(['colony.id', 'colony.caretakerId'])
      .where('colony.caretakerId IS NOT NULL')
      .getMany();
    return caretakers.map(c => ({
      ...c,
      colonyIds: colonies.filter(col => col.caretakerId === c.id).map(col => col.id),
    }));
  }

  async findAll(): Promise<CaretakerWithColonyIds[]> {
    const caretakers = await this.caretakerRepo.find({
      order: { lastName: 'ASC', firstName: 'ASC' },
    });
    return this.attachColonyIds(caretakers);
  }

  async findOne(id: string): Promise<CaretakerWithColonyIds> {
    const caretaker = await this.caretakerRepo.findOne({ where: { id } });
    if (!caretaker) throw new NotFoundException(`Caretaker ${id} not found`);
    const [withIds] = await this.attachColonyIds([caretaker]);
    return withIds;
  }

  create(dto: CreateCaretakerDto): Promise<Caretaker> {
    const caretaker = this.caretakerRepo.create(dto);
    return this.caretakerRepo.save(caretaker);
  }

  async update(id: string, dto: UpdateCaretakerDto): Promise<Caretaker> {
    const caretaker = await this.caretakerRepo.findOne({ where: { id } });
    if (!caretaker) throw new NotFoundException(`Caretaker ${id} not found`);
    Object.assign(caretaker, dto);
    return this.caretakerRepo.save(caretaker);
  }

  async remove(id: string): Promise<void> {
    const caretaker = await this.caretakerRepo.findOne({ where: { id } });
    if (!caretaker) throw new NotFoundException(`Caretaker ${id} not found`);
    await this.caretakerRepo.remove(caretaker);
  }
}
