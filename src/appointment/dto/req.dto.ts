import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateAppointmentDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  staffId: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  serviceId: number;

  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  startTime: Date;

  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  endTime: Date;
}
