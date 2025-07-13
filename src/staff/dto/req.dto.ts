import { PaginationDto } from '@common/utils/pagination';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsTimeZone,
  Matches,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateStaffDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsTimeZone()
  timezone: string = 'UTC';

  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateWorkingHoursDto)
  @IsOptional()
  workingHours?: CreateWorkingHoursDto[];
}

export class CreateWorkingHoursDto {
  @ApiProperty()
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek: number;

  @ApiProperty()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'startTime must be in HH:mm format',
  })
  startTime: string;

  @ApiProperty()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'endTime must be in HH:mm format',
  })
  endTime: string;
}

export class FetchStaffDto extends PaginationDto {
  @ApiProperty()
  @Transform(({ value }) => (value ? Number(value) : 1))
  page: number = 1;

  @ApiProperty()
  @Transform(({ value }) => (value ? Number(value) : 10))
  size: number = 10;
}
