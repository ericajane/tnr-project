import { PartialType } from '@nestjs/mapped-types';
import { CreateCaretakerDto } from './create-caretaker.dto';

export class UpdateCaretakerDto extends PartialType(CreateCaretakerDto) {}
