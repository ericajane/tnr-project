import { IsString, IsOptional, IsIn, IsDateString } from 'class-validator';
import { CatStatus, CatSex } from '../entities/cat.entity';

export class CreateCatDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsIn(['trapped', 'neutered', 'returned', 'deceased'])
  status?: CatStatus;

  @IsOptional()
  @IsDateString()
  trapDate?: string;

  @IsOptional()
  @IsDateString()
  neuterDate?: string;

  @IsOptional()
  @IsIn(['male', 'female', 'unknown'])
  sex?: CatSex;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
