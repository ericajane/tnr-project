import { IsString, IsOptional, IsIn, IsNumber, IsDateString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { EquipmentCondition } from '../entities/equipment-item.entity';
import { NoteDto } from '../../common/dto/note.dto';

export class CreateEquipmentItemDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  quantity?: number;

  @IsOptional()
  @IsIn(['good', 'fair', 'poor'])
  condition?: EquipmentCondition;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsDateString()
  lastMaintenanceDate?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NoteDto)
  notes?: NoteDto[];
}
