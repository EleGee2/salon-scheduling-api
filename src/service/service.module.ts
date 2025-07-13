import { Module } from '@nestjs/common';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from '@src/service/entities/service.entity';
import { Staff } from '@src/staff/entities/staff.entity';
import { AvailabilityModule } from '@src/availability/availability.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  controllers: [ServiceController],
  providers: [ServiceService],
  imports: [AvailabilityModule, CacheModule.register(), TypeOrmModule.forFeature([Service, Staff])],
})
export class ServiceModule {}
