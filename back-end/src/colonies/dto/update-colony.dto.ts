import { PartialType } from '@nestjs/mapped-types';
import { CreateColonyDto } from './create-colony.dto';

export class UpdateColonyDto extends PartialType(CreateColonyDto) {}
