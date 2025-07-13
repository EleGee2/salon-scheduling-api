import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { StaffService } from './staff.service';
import { CreateStaffDto, FetchStaffDto } from './dto/req.dto';
import { ApiTags } from '@nestjs/swagger';
import { PaginatedSuccessResponseObject, SuccessResponseObject } from '@common/utils/http';
import { getPagingMeta } from '@common/utils/pagination';

@ApiTags('Staffs')
@Controller('staff')
export class StaffController {
  constructor(private readonly service: StaffService) {}

  @Post()
  async createStaff(@Body() data: CreateStaffDto) {
    const staff = await this.service.createStaff(data);

    return new SuccessResponseObject('staff created successfully', staff);
  }

  @Get()
  async fetchStaff(@Query() query: FetchStaffDto) {
    const page = query.page ?? 1;
    const size = query.size ?? 10;
    const { data, total } = await this.service.fetchStaffs({ ...query, page, size });

    return new PaginatedSuccessResponseObject(
      'staff retrieved',
      data,
      getPagingMeta({ ...query, page, size }, total),
    );
  }
}
