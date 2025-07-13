import { IsDate, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateAppointmentDto {
  @IsNumber()
  @IsNotEmpty()
  staffId: number;

  @IsNumber()
  @IsNotEmpty()
  serviceId: number;

  @IsDate()
  @IsNotEmpty()
  startTime: Date;

  @IsDate()
  @IsNotEmpty()
  endTime: Date;
}
