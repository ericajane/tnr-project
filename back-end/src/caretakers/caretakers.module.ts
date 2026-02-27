import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Caretaker } from './entities/caretaker.entity';
import { Colony } from '../colonies/entities/colony.entity';
import { CaretakersService } from './caretakers.service';
import { CaretakersController } from './caretakers.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Caretaker, Colony])],
  controllers: [CaretakersController],
  providers: [CaretakersService],
})
export class CaretakersModule {}
