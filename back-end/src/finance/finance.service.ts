import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FinanceRecord } from './entities/finance-record.entity';
import { CreateFinanceRecordDto } from './dto/create-finance-record.dto';
import { UpdateFinanceRecordDto } from './dto/update-finance-record.dto';

@Injectable()
export class FinanceService {
  constructor(
    @InjectRepository(FinanceRecord)
    private readonly repo: Repository<FinanceRecord>,
  ) {}

  findAll(): Promise<FinanceRecord[]> {
    return this.repo.find({ order: { date: 'DESC' } });
  }

  async findOne(id: string): Promise<FinanceRecord> {
    const record = await this.repo.findOne({ where: { id } });
    if (!record) throw new NotFoundException(`Finance record ${id} not found`);
    return record;
  }

  create(dto: CreateFinanceRecordDto): Promise<FinanceRecord> {
    const record = this.repo.create(dto);
    return this.repo.save(record);
  }

  async update(id: string, dto: UpdateFinanceRecordDto): Promise<FinanceRecord> {
    const record = await this.findOne(id);
    Object.assign(record, dto);
    return this.repo.save(record);
  }

  async remove(id: string): Promise<void> {
    const record = await this.findOne(id);
    await this.repo.remove(record);
  }
}
