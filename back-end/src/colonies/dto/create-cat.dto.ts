import { IsString, IsOptional, IsIn, IsDateString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CatStatus, CatSex } from '../entities/cat.entity';
import { NoteDto } from '../../common/dto/note.dto';

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
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NoteDto)
  notes?: NoteDto[];
}
