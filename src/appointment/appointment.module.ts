import { Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { Service } from '@src/service/entities/service.entity';
import { Staff } from '@src/staff/entities/staff.entity';
import { WebhookModule } from '@src/webhook/webhook.module';
import { AppointmentController } from './appointment.controller';

@Module({
  controllers: [AppointmentController],
  providers: [AppointmentService, AppointmentController],
  imports: [WebhookModule, TypeOrmModule.forFeature([Appointment, Service, Staff])],
})
export class AppointmentModule {}
