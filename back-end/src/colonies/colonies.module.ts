import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColoniesService } from './colonies.service';
import { ColoniesController } from './colonies.controller';
import { Colony } from './entities/colony.entity';
import { Cat } from './entities/cat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Colony, Cat])],
  providers: [ColoniesService],
  controllers: [ColoniesController],
})
export class ColoniesModule {}
