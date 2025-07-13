import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateAppointmentDto } from './dto/req.dto';
import { SuccessResponseObject } from '@common/utils/http';
import { ApiKeyAuthGuard } from '@src/auth/auth.guard';

@ApiTags('Appointments')
@Controller('appointments')
export class AppointmentController {
  constructor(private readonly service: AppointmentService) {}

  @Post()
  @UseGuards(ApiKeyAuthGuard)
  async createAppointment(@Body() data: CreateAppointmentDto) {
    const appointment = await this.service.createAppointment(data);

    return new SuccessResponseObject('appointment created successfully', appointment);
  }
}
