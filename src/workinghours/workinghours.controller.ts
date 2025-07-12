import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WorkinghoursService } from './workinghours.service';
import { CreateWorkinghourDto } from './dto/create-workinghour.dto';
import { UpdateWorkinghourDto } from './dto/update-workinghour.dto';

@Controller('workinghours')
export class WorkinghoursController {
  constructor(private readonly workinghoursService: WorkinghoursService) {}

  @Post()
  create(@Body() createWorkinghourDto: CreateWorkinghourDto) {
    return this.workinghoursService.create(createWorkinghourDto);
  }

  @Get()
  findAll() {
    return this.workinghoursService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workinghoursService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWorkinghourDto: UpdateWorkinghourDto) {
    return this.workinghoursService.update(+id, updateWorkinghourDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workinghoursService.remove(+id);
  }
}
