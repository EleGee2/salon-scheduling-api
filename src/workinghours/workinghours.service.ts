import { Injectable } from '@nestjs/common';
import { CreateWorkinghourDto } from './dto/create-workinghour.dto';
import { UpdateWorkinghourDto } from './dto/update-workinghour.dto';

@Injectable()
export class WorkinghoursService {
  create(createWorkinghourDto: CreateWorkinghourDto) {
    return 'This action adds a new workinghour';
  }

  findAll() {
    return `This action returns all workinghours`;
  }

  findOne(id: number) {
    return `This action returns a #${id} workinghour`;
  }

  update(id: number, updateWorkinghourDto: UpdateWorkinghourDto) {
    return `This action updates a #${id} workinghour`;
  }

  remove(id: number) {
    return `This action removes a #${id} workinghour`;
  }
}
