import { PaginationDto } from '@common/utils/pagination';
import { Transform } from 'class-transformer';

export class FetchStaffDto extends PaginationDto {
  @Transform(({ value }) => (value ? Number(value) : 1))
  page: number = 1;

  @Transform(({ value }) => (value ? Number(value) : 10))
  size: number = 10;
}
