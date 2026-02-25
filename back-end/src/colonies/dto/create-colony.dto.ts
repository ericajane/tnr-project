import { IsString, IsOptional, IsNumber, IsUUID, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { NoteDto } from '../../common/dto/note.dto';

export class CreateColonyDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  lat?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  lng?: number;

  @IsOptional()
  @IsUUID()
  caretakerId?: string;

  @IsOptional()
  @IsString()
  caretakerName?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NoteDto)
  notes?: NoteDto[];
}
