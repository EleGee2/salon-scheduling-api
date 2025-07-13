import { Test, TestingModule } from '@nestjs/testing';
import { ServiceService } from './service.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { Staff } from '@src/staff/entities/staff.entity';
import { Appointment } from '@src/appointment/entities/appointment.entity';
import { createMockRepository, MockRepository } from '@common/types';
import { NotFoundException } from '@nestjs/common';
import { AvailabilityService } from '@src/availability/availability.service';

const mockService = {
  id: 1,
  name: 'Haircut',
  duration: 60,
  price: 50,
  buffer_time: 15,
  staff: [],
} as unknown as Service;

const mockStaff = {
  id: 1,
  name: 'Jane Doe',
  timezone: 'UTC',
  workingHours: [],
  appointments: [],
  services: [],
} as unknown as Staff;

describe('ServiceService', () => {
  let service: ServiceService;
  let serviceRepo: MockRepository<Service>;
  let staffRepo: MockRepository<Staff>;
  let appointmentRepo: MockRepository<Appointment>;
  let availabilityService: AvailabilityService;

  beforeEach(async () => {
    serviceRepo = createMockRepository();
    staffRepo = createMockRepository();
    appointmentRepo = createMockRepository();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServiceService,
        { provide: getRepositoryToken(Service), useValue: serviceRepo },
        { provide: getRepositoryToken(Staff), useValue: staffRepo },
        { provide: getRepositoryToken(Appointment), useValue: appointmentRepo },
        AvailabilityService,
      ],
    }).compile();

    service = module.get<ServiceService>(ServiceService);
    availabilityService = module.get<AvailabilityService>(AvailabilityService);
    jest.spyOn(availabilityService, 'getAvailability').mockResolvedValue([]);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createService', () => {
    it('should create and save a new service', async () => {
      serviceRepo.create.mockReturnValue(mockService);
      serviceRepo.save.mockResolvedValue(mockService);
      const data = { name: 'Haircut', duration: 60, price: 50, buffer_time: 15 };
      const result = await service.createService(data);
      expect(result).toBe(mockService);
      expect(serviceRepo.create).toHaveBeenCalledWith(data);
      expect(serviceRepo.save).toHaveBeenCalledWith(mockService);
    });
  });

  describe('findServices', () => {
    it('should return paginated services', async () => {
      serviceRepo.findAndCount.mockResolvedValue([[mockService], 1]);
      const result = await service.findServices({ page: 1, size: 10 });
      expect(result).toEqual({ data: [mockService], total: 1 });
      expect(serviceRepo.findAndCount).toHaveBeenCalledWith({
        take: 10,
        skip: 0,
        order: { id: 'ASC' },
      });
    });
  });

  describe('findService', () => {
    it('should return a service by id', async () => {
      serviceRepo.findOneBy.mockResolvedValue(mockService);
      const result = await service.findService({ id: 1 });
      expect(result).toBe(mockService);
      expect(serviceRepo.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw NotFoundException if not found', async () => {
      serviceRepo.findOne.mockResolvedValue(null);
      await expect(service.findService({ id: 2 })).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateService', () => {
    it('should update and return the service', async () => {
      serviceRepo.preload.mockResolvedValue(mockService);
      serviceRepo.save.mockResolvedValue(mockService);
      const data = { id: 1, name: 'Updated' };
      const result = await service.updateService(data);
      expect(result).toBe(mockService);
      expect(serviceRepo.preload).toHaveBeenCalledWith(data);
      expect(serviceRepo.save).toHaveBeenCalledWith(mockService);
    });
    it('should throw NotFoundException if not found', async () => {
      serviceRepo.preload.mockResolvedValue(undefined);
      await expect(service.updateService({ id: 2, name: 'X' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('assignServiceStaff', () => {
    it('should assign staff to a service', async () => {
      serviceRepo.findOne.mockResolvedValue({ ...mockService, staff: [] });
      staffRepo.findBy.mockResolvedValue([mockStaff]);
      serviceRepo.save.mockResolvedValue({ ...mockService, staff: [mockStaff] });
      const result = await service.assignServiceStaff({ serviceId: 1, staffIds: [1] });
      expect(result.staff).toContain(mockStaff);
      expect(serviceRepo.save).toHaveBeenCalledWith({ ...mockService, staff: [mockStaff] });
    });
    it('should throw NotFoundException if service not found', async () => {
      serviceRepo.findOne.mockResolvedValue(null);
      await expect(service.assignServiceStaff({ serviceId: 2, staffIds: [1] })).rejects.toThrow(
        NotFoundException,
      );
    });
    it('should throw NotFoundException if any staff not found', async () => {
      serviceRepo.findOne.mockResolvedValue({ ...mockService, staff: [] });
      staffRepo.findBy.mockResolvedValue([]);
      await expect(service.assignServiceStaff({ serviceId: 1, staffIds: [1] })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('fetchServiceStaff', () => {
    it('should return staff for a service', async () => {
      serviceRepo.findOne.mockResolvedValue({ ...mockService, staff: [mockStaff] });
      const result = await service.fetchServiceStaff({ serviceId: 1 });
      expect(result).toEqual([mockStaff]);
    });
    it('should throw NotFoundException if service not found', async () => {
      serviceRepo.findOne.mockResolvedValue(null);
      await expect(service.fetchServiceStaff({ serviceId: 2 })).rejects.toThrow(NotFoundException);
    });
  });

  describe('fetchServiceStaffAvailabilty', () => {
    it('should return staff availability from availabilityService', async () => {
      const mockAvailability = [{ staffId: 1, availableSlots: ['09:00'] }];
      (availabilityService.getAvailability as jest.Mock).mockResolvedValue(mockAvailability);
      const result = await service.fetchServiceStaffAvailabilty({
        serviceId: 1,
        date: '2025-07-14',
      });
      expect(result).toBe(mockAvailability);
      expect(availabilityService.getAvailability).toHaveBeenCalledWith({
        serviceId: 1,
        date: '2025-07-14',
      });
    });
  });
});
