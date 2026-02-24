import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinanceService } from './finance.service';
import { FinanceController } from './finance.controller';
import { FinanceRecord } from './entities/finance-record.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FinanceRecord])],
  providers: [FinanceService],
  controllers: [FinanceController],
})
export class FinanceModule {}
