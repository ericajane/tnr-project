import { IsString, IsOptional, IsIn, IsDateString, IsUUID } from 'class-validator';
import { AppointmentType, AppointmentStatus } from '../entities/appointment.entity';

export class CreateAppointmentDto {
  @IsOptional()
  @IsUUID()
  catId?: string;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsString()
  clinic?: string;

  @IsOptional()
  @IsString()
  vetName?: string;

  @IsOptional()
  @IsIn(['neuter', 'checkup', 'followup', 'other'])
  type?: AppointmentType;

  @IsOptional()
  @IsIn(['scheduled', 'completed', 'cancelled'])
  status?: AppointmentStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}
