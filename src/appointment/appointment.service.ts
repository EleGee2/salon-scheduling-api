import { Injectable } from '@nestjs/common';
import { CreateAppointmentArg } from './types';

@Injectable()
export class AppointmentService {
  async createAppointment(data: CreateAppointmentArg) {
    return 'This action adds a new appointment';
  }
}
