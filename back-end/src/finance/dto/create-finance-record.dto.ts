import { IsString, IsOptional, IsIn, IsDateString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { FinanceType } from '../entities/finance-record.entity';

export class CreateFinanceRecordDto {
  @IsIn(['income', 'expense'])
  type: FinanceType;

  @IsNumber()
  @Type(() => Number)
  amount: number;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  date: string;
}
