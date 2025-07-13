import { Module } from '@nestjs/common';
import { AvailabilityService } from './availability.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from '@src/service/entities/service.entity';
import { Appointment } from '@src/appointment/entities/appointment.entity';
import { AvailabilityResolver } from './availability.resolver';

@Module({
  exports: [AvailabilityService],
  providers: [AvailabilityService, AvailabilityResolver],
  imports: [TypeOrmModule.forFeature([Service, Appointment])],
})
export class AvailabilityModule {}
