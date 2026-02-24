import { IsString, IsOptional, IsIn, IsDateString, IsUUID, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AppointmentType, AppointmentStatus } from '../entities/appointment.entity';
import { NoteDto } from '../../common/dto/note.dto';

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
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NoteDto)
  notes?: NoteDto[];
}
