import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Injectable()
export class VeterinaryService {
  constructor(
    @InjectRepository(Appointment)
    private readonly repo: Repository<Appointment>,
  ) {}

  findAll(): Promise<Appointment[]> {
    return this.repo.find({
      relations: ['cat'],
      order: { date: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Appointment> {
    const appt = await this.repo.findOne({ where: { id }, relations: ['cat'] });
    if (!appt) throw new NotFoundException(`Appointment ${id} not found`);
    return appt;
  }

  create(dto: CreateAppointmentDto): Promise<Appointment> {
    const appt = this.repo.create(dto);
    return this.repo.save(appt);
  }

  async update(id: string, dto: UpdateAppointmentDto): Promise<Appointment> {
    const appt = await this.findOne(id);
    Object.assign(appt, dto);
    return this.repo.save(appt);
  }

  async remove(id: string): Promise<void> {
    const appt = await this.findOne(id);
    await this.repo.remove(appt);
  }
}
