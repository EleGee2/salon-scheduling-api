import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from '@src/service/entities/service.entity';
import { In, Repository } from 'typeorm';
import { getOffset } from '@common/utils/pagination';
import { Staff } from '@src/staff/entities/staff.entity';
import {
  AssignStaffArg,
  CreateServiceArg,
  FetchAssignedStaffArg,
  FetchAvailabityArg,
  FetchServiceArg,
  FetchServicesArg,
  StaffAvailability,
  UpdateServiceArg,
} from './types';
import { AvailabilityService } from '@src/availability/availability.service';

@Injectable()
export class ServiceService {
  constructor(
    private readonly availabilityService: AvailabilityService,
    @InjectRepository(Service) private serviceRepo: Repository<Service>,
    @InjectRepository(Staff) private staffRepo: Repository<Staff>,
  ) {}

  async createService(data: CreateServiceArg): Promise<Service> {
    const newService = this.serviceRepo.create(data);
    return this.serviceRepo.save(newService);
  }

  async findServices(data: FetchServicesArg): Promise<{ data: Service[]; total: number }> {
    const { page = 1, size = 10 } = data;
    const offset = getOffset(page, size);
    const [services, total] = await this.serviceRepo.findAndCount({
      take: size,
      skip: offset,
      order: {
        id: 'ASC',
      },
    });

    return {
      total,
      data: services,
    };
  }

  async findService(data: FetchServiceArg): Promise<Service> {
    const service = await this.serviceRepo.findOneBy({ id: data.id });
    if (!service) {
      throw new NotFoundException(`service with not found`);
    }
    return service;
  }

  async updateService(data: UpdateServiceArg): Promise<Service> {
    const service = await this.serviceRepo.preload(data);

    if (!service) {
      throw new NotFoundException(`service not found`);
    }

    return this.serviceRepo.save(service);
  }

  async assignServiceStaff(data: AssignStaffArg): Promise<Service> {
    const { serviceId, staffIds } = data;
    const service = await this.serviceRepo.findOne({
      where: { id: serviceId },
      relations: ['staff'],
    });

    if (!service) {
      throw new NotFoundException(`service with not found`);
    }

    const staffMembers = await this.staffRepo.findBy({
      id: In(staffIds),
    });

    if (staffMembers.length !== staffIds.length) {
      const foundIds = staffMembers.map((s) => s.id);
      const notFoundIds = staffIds.filter((id) => !foundIds.includes(id));
      throw new NotFoundException(
        `staff with the following IDs not found: ${notFoundIds.join(', ')}`,
      );
    }
    service.staff = staffMembers;
    return this.serviceRepo.save(service);
  }

  async fetchServiceStaff(data: FetchAssignedStaffArg): Promise<Staff[]> {
    const service = await this.serviceRepo.findOne({
      where: { id: data.serviceId },
      relations: ['staff'],
    });

    if (!service) {
      throw new NotFoundException(`service not found`);
    }

    return service.staff;
  }

  async fetchServiceStaffAvailabilty(data: FetchAvailabityArg): Promise<StaffAvailability[]> {
    const staffSchedules = await this.availabilityService.getAvailability(data);

    return staffSchedules;
  }
}
