import { PaginationDto } from '@common/utils/pagination';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsPositive,
  IsNumber,
  IsArray,
  ArrayNotEmpty,
  ValidateNested,
  IsDateString,
} from 'class-validator';

export class CreateServiceDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 30 })
  @IsInt()
  @IsPositive()
  duration: number; // in minutes

  @ApiProperty({ example: 1500 })
  @IsNumber()
  price: number;

  @ApiProperty({ example: 30 })
  @IsInt()
  @IsPositive()
  buffer_time: number;
}

export class FetchServiceDto extends PaginationDto {
  @Transform(({ value }) => (value ? Number(value) : 1))
  page: number = 1;

  @Transform(({ value }) => (value ? Number(value) : 10))
  size: number = 10;
}

export class UpdateServiceDto extends PartialType(CreateServiceDto) {}

export class AssignStaffDto {
  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  staffIds: number[];
}

export class FetchStaffAvailibilityDto {
  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  date: string;
}
