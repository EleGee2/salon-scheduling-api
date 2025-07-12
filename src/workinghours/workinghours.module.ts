import { Module } from '@nestjs/common';
import { WorkinghoursService } from './workinghours.service';
import { WorkinghoursController } from './workinghours.controller';

@Module({
  controllers: [WorkinghoursController],
  providers: [WorkinghoursService],
})
export class WorkinghoursModule {}
