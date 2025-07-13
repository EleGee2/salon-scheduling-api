import { Test, TestingModule } from '@nestjs/testing';
import { StaffService } from './staff.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Staff } from './entities/staff.entity';
import { DataSource } from 'typeorm';
import { createMockRepository, MockRepository } from '@common/types';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const mockStaff = {
  id: 1,
  name: 'John Doe',
  timezone: 'UTC',
  workingHours: [],
  appointments: [],
  services: [],
} as unknown as Staff;

describe('StaffService', () => {
  let service: StaffService;
  let staffRepo: MockRepository<Staff>;
  let dataSource: DataSource;

  beforeEach(async () => {
    staffRepo = createMockRepository();
    dataSource = {
      createQueryRunner: jest.fn().mockReturnValue({
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
        manager: {
          create: jest.fn().mockImplementation((_: any, data: any) => data),
          save: jest.fn().mockImplementation((data: any) => Promise.resolve({ ...data, id: 1 })),
        },
      }),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StaffService,
        { provide: getRepositoryToken(Staff), useValue: staffRepo },
        { provide: DataSource, useValue: dataSource },
      ],
    }).compile();

    service = module.get<StaffService>(StaffService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('fetchStaff', () => {
    it('should return a staff by id', async () => {
      staffRepo.findOne.mockResolvedValue(mockStaff);
      const result = await service.fetchStaff({ id: 1 });
      expect(result).toBe(mockStaff);
      expect(staffRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['workingHours', 'services'],
      });
    });

    it('should throw NotFoundException if staff not found', async () => {
      staffRepo.findOne.mockResolvedValue(null);
      await expect(service.fetchStaff({ id: 2 })).rejects.toThrow(NotFoundException);
    });
  });

  describe('fetchStaffs', () => {
    it('should return paginated staff list', async () => {
      staffRepo.findAndCount.mockResolvedValue([[mockStaff], 1]);
      const result = await service.fetchStaffs({ page: 1, size: 10 });
      expect(result).toEqual({ data: [mockStaff], total: 1 });
      expect(staffRepo.findAndCount).toHaveBeenCalledWith({
        take: 10,
        skip: 0,
        order: { name: 'ASC' },
        relations: ['workingHours'],
      });
    });
  });

  describe('createStaff', () => {
    it('should create staff and working hours', async () => {
      const mockRunner = dataSource.createQueryRunner();
      (mockRunner.manager.create as jest.Mock).mockImplementation((_: any, data: any) => data);
      (mockRunner.manager.save as jest.Mock).mockImplementation((data: any) =>
        Promise.resolve({ ...data, id: 1 }),
      );
      jest.spyOn(service, 'fetchStaff').mockResolvedValue(mockStaff);

      const data = {
        name: 'John Doe',
        timezone: 'UTC',
        workingHours: [{ dayOfWeek: 1, startTime: '09:00:00', endTime: '17:00:00' }],
      };
      const result = await service.createStaff(data);
      expect(result).toBe(mockStaff);
      expect(mockRunner.startTransaction).toHaveBeenCalled();
      expect(mockRunner.commitTransaction).toHaveBeenCalled();
      expect(service.fetchStaff).toHaveBeenCalledWith({ id: 1 });
    });

    it('should rollback and throw BadRequestException on error', async () => {
      const mockRunner = dataSource.createQueryRunner();
      (mockRunner.manager.save as jest.Mock).mockRejectedValueOnce(new Error('fail'));
      const data = { name: 'John Doe', timezone: 'UTC', workingHours: [] };
      await expect(service.createStaff(data)).rejects.toThrow(BadRequestException);
      expect(mockRunner.rollbackTransaction).toHaveBeenCalled();
    });
  });
});
