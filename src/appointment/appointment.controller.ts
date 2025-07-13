import { Body, Controller, Post } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { SuccessResponseObject } from '@common/utils/http';

@ApiTags('Appointments')
@Controller('appointments')
export class AppointmentController {
  constructor(private readonly service: AppointmentService) {}

  @Post()
  async createAppointment(@Body() data: CreateAppointmentDto) {
    const appointment = await this.service.createAppointment(data);

    return new SuccessResponseObject('appointment created successfully', appointment);
  }
}
