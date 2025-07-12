import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationDto {
  @ApiPropertyOptional()
  page: number;

  @ApiPropertyOptional()
  size: number;
}

export const getOffset = (page: number, size: number) => {
  return (page - 1) * size;
};

export const getPageCount = (count: number, size: number) => {
  return Math.ceil(count / size);
};

export const getPagingMeta = (
  query: { page: number; size: number },
  count: number,
) => ({
  page: query.page,
  pages: getPageCount(count, query.size),
  size: query.size,
  total: count,
});
