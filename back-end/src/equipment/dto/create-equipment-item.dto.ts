import { IsString, IsOptional, IsIn, IsNumber, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { EquipmentCondition } from '../entities/equipment-item.entity';

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
  @IsString()
  notes?: string;
}
