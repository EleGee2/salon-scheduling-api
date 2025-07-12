import { PartialType } from '@nestjs/swagger';
import { CreateWorkinghourDto } from './create-workinghour.dto';

export class UpdateWorkinghourDto extends PartialType(CreateWorkinghourDto) {}
