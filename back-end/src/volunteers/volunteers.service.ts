import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Volunteer } from './entities/volunteer.entity';
import { CreateVolunteerDto } from './dto/create-volunteer.dto';
import { UpdateVolunteerDto } from './dto/update-volunteer.dto';

@Injectable()
export class VolunteersService {
  constructor(
    @InjectRepository(Volunteer)
    private readonly repo: Repository<Volunteer>,
  ) {}

  findAll(): Promise<Volunteer[]> {
    return this.repo.find({ order: { name: 'ASC' } });
  }

  async findOne(id: string): Promise<Volunteer> {
    const volunteer = await this.repo.findOne({ where: { id } });
    if (!volunteer) throw new NotFoundException(`Volunteer ${id} not found`);
    return volunteer;
  }

  create(dto: CreateVolunteerDto): Promise<Volunteer> {
    const volunteer = this.repo.create(dto);
    return this.repo.save(volunteer);
  }

  async update(id: string, dto: UpdateVolunteerDto): Promise<Volunteer> {
    const volunteer = await this.findOne(id);
    Object.assign(volunteer, dto);
    return this.repo.save(volunteer);
  }

  async remove(id: string): Promise<void> {
    const volunteer = await this.findOne(id);
    await this.repo.remove(volunteer);
  }
}
