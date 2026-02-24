import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Colony } from './entities/colony.entity';
import { Cat } from './entities/cat.entity';
import { CreateColonyDto } from './dto/create-colony.dto';
import { UpdateColonyDto } from './dto/update-colony.dto';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';

@Injectable()
export class ColoniesService {
  constructor(
    @InjectRepository(Colony)
    private readonly colonyRepo: Repository<Colony>,
    @InjectRepository(Cat)
    private readonly catRepo: Repository<Cat>,
  ) {}

  findAllColonies(): Promise<Colony[]> {
    return this.colonyRepo.find({
      relations: ['caretaker', 'cats'],
      order: { name: 'ASC' },
    });
  }

  async findOneColony(id: string): Promise<Colony> {
    const colony = await this.colonyRepo.findOne({
      where: { id },
      relations: ['caretaker', 'cats'],
    });
    if (!colony) throw new NotFoundException(`Colony ${id} not found`);
    return colony;
  }

  createColony(dto: CreateColonyDto): Promise<Colony> {
    const colony = this.colonyRepo.create(dto);
    return this.colonyRepo.save(colony);
  }

  async updateColony(id: string, dto: UpdateColonyDto): Promise<Colony> {
    const colony = await this.findOneColony(id);
    Object.assign(colony, dto);
    return this.colonyRepo.save(colony);
  }

  async removeColony(id: string): Promise<void> {
    const colony = await this.findOneColony(id);
    await this.colonyRepo.remove(colony);
  }

  async findCats(colonyId: string): Promise<Cat[]> {
    await this.findOneColony(colonyId);
    return this.catRepo.find({ where: { colonyId }, order: { createdAt: 'DESC' } });
  }

  async findOneCat(colonyId: string, catId: string): Promise<Cat> {
    const cat = await this.catRepo.findOne({ where: { id: catId, colonyId } });
    if (!cat) throw new NotFoundException(`Cat ${catId} not found in colony ${colonyId}`);
    return cat;
  }

  async createCat(colonyId: string, dto: CreateCatDto): Promise<Cat> {
    await this.findOneColony(colonyId);
    const cat = this.catRepo.create({ ...dto, colonyId });
    return this.catRepo.save(cat);
  }

  async updateCat(colonyId: string, catId: string, dto: UpdateCatDto): Promise<Cat> {
    const cat = await this.findOneCat(colonyId, catId);
    Object.assign(cat, dto);
    return this.catRepo.save(cat);
  }

  async removeCat(colonyId: string, catId: string): Promise<void> {
    const cat = await this.findOneCat(colonyId, catId);
    await this.catRepo.remove(cat);
  }
}
