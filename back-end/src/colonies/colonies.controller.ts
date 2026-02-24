import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ColoniesService } from './colonies.service';
import { CreateColonyDto } from './dto/create-colony.dto';
import { UpdateColonyDto } from './dto/update-colony.dto';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';

@UseGuards(JwtAuthGuard)
@Controller('colonies')
export class ColoniesController {
  constructor(private readonly service: ColoniesService) {}

  // Colony CRUD
  @Get()
  findAll() {
    return this.service.findAllColonies();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOneColony(id);
  }

  @Post()
  create(@Body() dto: CreateColonyDto) {
    return this.service.createColony(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateColonyDto) {
    return this.service.updateColony(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.removeColony(id);
  }

  // Nested cat routes
  @Get(':id/cats')
  findCats(@Param('id') id: string) {
    return this.service.findCats(id);
  }

  @Post(':id/cats')
  createCat(@Param('id') id: string, @Body() dto: CreateCatDto) {
    return this.service.createCat(id, dto);
  }

  @Get(':id/cats/:catId')
  findOneCat(@Param('id') id: string, @Param('catId') catId: string) {
    return this.service.findOneCat(id, catId);
  }

  @Patch(':id/cats/:catId')
  updateCat(
    @Param('id') id: string,
    @Param('catId') catId: string,
    @Body() dto: UpdateCatDto,
  ) {
    return this.service.updateCat(id, catId, dto);
  }

  @Delete(':id/cats/:catId')
  removeCat(@Param('id') id: string, @Param('catId') catId: string) {
    return this.service.removeCat(id, catId);
  }
}
