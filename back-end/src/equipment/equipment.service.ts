import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EquipmentItem } from './entities/equipment-item.entity';
import { CreateEquipmentItemDto } from './dto/create-equipment-item.dto';
import { UpdateEquipmentItemDto } from './dto/update-equipment-item.dto';

@Injectable()
export class EquipmentService {
  constructor(
    @InjectRepository(EquipmentItem)
    private readonly repo: Repository<EquipmentItem>,
  ) {}

  findAll(): Promise<EquipmentItem[]> {
    return this.repo.find({ order: { name: 'ASC' } });
  }

  async findOne(id: string): Promise<EquipmentItem> {
    const item = await this.repo.findOne({ where: { id } });
    if (!item) throw new NotFoundException(`Equipment item ${id} not found`);
    return item;
  }

  create(dto: CreateEquipmentItemDto): Promise<EquipmentItem> {
    const item = this.repo.create(dto);
    return this.repo.save(item);
  }

  async update(id: string, dto: UpdateEquipmentItemDto): Promise<EquipmentItem> {
    const item = await this.findOne(id);
    Object.assign(item, dto);
    return this.repo.save(item);
  }

  async remove(id: string): Promise<void> {
    const item = await this.findOne(id);
    await this.repo.remove(item);
  }
}
