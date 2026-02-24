import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EquipmentService } from './equipment.service';
import { EquipmentController } from './equipment.controller';
import { EquipmentItem } from './entities/equipment-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EquipmentItem])],
  providers: [EquipmentService],
  controllers: [EquipmentController],
})
export class EquipmentModule {}
