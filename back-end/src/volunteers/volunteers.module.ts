import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VolunteersService } from './volunteers.service';
import { VolunteersController } from './volunteers.controller';
import { Volunteer } from './entities/volunteer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Volunteer])],
  providers: [VolunteersService],
  controllers: [VolunteersController],
  exports: [VolunteersService],
})
export class VolunteersModule {}
