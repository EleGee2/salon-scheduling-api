import { Controller, Get, Post, Body, Query, Param, Patch, ParseIntPipe } from '@nestjs/common';
import { ServiceService } from './service.service';
import {
  AssignStaffDto,
  CreateServiceDto,
  FetchServiceDto,
  FetchStaffAvailibilityDto,
  UpdateServiceDto,
} from './dto/req.dto';
import { ApiTags } from '@nestjs/swagger';
import { PaginatedSuccessResponseObject, SuccessResponseObject } from '@common/utils/http';
import { getPagingMeta } from '@common/utils/pagination';

@ApiTags('Services')
@Controller('services')
export class ServiceController {
  constructor(private readonly service: ServiceService) {}

  @Post()
  async createService(@Body() data: CreateServiceDto) {
    const service = await this.service.createService(data);

    return new SuccessResponseObject('service created successfully', service);
  }

  @Get()
  async fetchServices(@Query() query: FetchServiceDto) {
    const page = query.page ?? 1;
    const size = query.size ?? 10;
    const { data, total } = await this.service.findServices({ ...query, page, size });

    return new PaginatedSuccessResponseObject(
      'services retrieved',
      data,
      getPagingMeta({ ...query, page, size }, total),
    );
  }

  @Patch(':id')
  async updateService(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateServiceDto) {
    const service = await this.service.updateService({ id, ...data });

    return new SuccessResponseObject('service updated successfully', service);
  }

  @Post('/:id/staff')
  async assignStaff(@Param('id', ParseIntPipe) id: number, @Body() data: AssignStaffDto) {
    const service = await this.service.assignServiceStaff({
      serviceId: id,
      staffIds: data.staffIds,
    });

    return new SuccessResponseObject('assigned staff to service successfully', service);
  }

  @Get('/:id/staff')
  async fetchAssignedStaff(@Param('id', ParseIntPipe) id: number) {
    const staffs = await this.service.fetchServiceStaff({ serviceId: id });

    return new SuccessResponseObject('service staff fetched successfully', staffs);
  }

  @Get('/:id/availability')
  async fetchServiceStaffAvailabilty(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: FetchStaffAvailibilityDto,
  ) {
    const schedules = await this.service.fetchServiceStaffAvailabilty({
      serviceId: id,
      date: query.date,
    });

    return new SuccessResponseObject('staff availability fetched successfully', schedules);
  }
}
