import { Module } from '@nestjs/common';
import { StaffService } from './staff.service';
import { StaffController } from './staff.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkingHours } from './entities/workinghour.entity';
import { Staff } from './entities/staff.entity';

@Module({
  controllers: [StaffController],
  providers: [StaffService],
  imports: [TypeOrmModule.forFeature([Staff, WorkingHours])],
})
export class StaffModule {}
