import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAppointmentArg } from './types';
import { WebhookService } from '@src/webhook/webhook.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { Service } from '@src/service/entities/service.entity';
import { Staff } from '@src/staff/entities/staff.entity';
import { Repository } from 'typeorm';
import { AppointmentArg } from '@src/webhook/types';

@Injectable()
export class AppointmentService {
  constructor(
    private readonly webhookService: WebhookService,
    @InjectRepository(Appointment) private readonly appointmentRepo: Repository<Appointment>,
    @InjectRepository(Service) private readonly serviceRepo: Repository<Service>,
    @InjectRepository(Staff) private readonly staffRepo: Repository<Staff>,
  ) {}

  async createAppointment(data: CreateAppointmentArg) {
    try {
      const newAppointment = this.appointmentRepo.create(data);
      const savedAppointment = await this.appointmentRepo.save(newAppointment);

      const [service, staff] = await Promise.all([
        this.serviceRepo.findOneBy({ id: data.serviceId }),
        this.staffRepo.findOneBy({ id: data.staffId }),
      ]);

      if (!service || !staff) {
        throw new BadRequestException('Service or staff not found');
      }

      // Create the AppointmentArg object for the webhook
      const appointmentArg: AppointmentArg = {
        id: savedAppointment.id,
        staffId: savedAppointment.staffId,
        serviceId: savedAppointment.serviceId,
        serviceName: service.name,
        staffName: staff.name,
        startTime: savedAppointment.startTime,
        endTime: savedAppointment.endTime,
      };

      this.webhookService.sendNewAppointmentWebhook(appointmentArg);

      return savedAppointment;
    } catch (error) {
      throw new BadRequestException(`Failed to create appointment: ${error.message}`);
    }
  }
}
