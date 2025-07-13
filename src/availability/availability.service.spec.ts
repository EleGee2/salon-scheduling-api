import { Test, TestingModule } from '@nestjs/testing';
import { AvailabilityService } from './availability.service';
import { createMockRepository, MockRepository } from '@common/types';
import { Appointment } from '@src/appointment/entities/appointment.entity';
import { Service } from '@src/service/entities/service.entity';
import { Staff } from '@src/staff/entities/staff.entity';
import { WorkingHours } from '@src/staff/entities/workinghour.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

describe('AvailabilityService', () => {
  let service: AvailabilityService;
  let serviceRepo: MockRepository<Service>;
  let appointmentRepo: MockRepository<Appointment>;

  const mockStaff = {
    id: 1,
    name: 'Jane Doe',
    timezone: 'America/New_York',
  } as Staff;

  const mockWorkingHours: WorkingHours[] = [
    { id: 1, dayOfWeek: 1, startTime: '09:00:00', endTime: '17:00:00', staff: mockStaff },
  ];

  // Now, complete the mockStaff object with its relations.
  mockStaff.workingHours = mockWorkingHours;
  mockStaff.appointments = [];
  mockStaff.services = [];

  const mockService: Service = {
    id: 1,
    name: 'Haircut',
    duration: 60, // 60 minutes
    buffer_time: 15, // 15 minutes
    price: 50,
    staff: [mockStaff],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AvailabilityService,
        {
          provide: getRepositoryToken(Service),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(Appointment),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<AvailabilityService>(AvailabilityService);
    serviceRepo = module.get(getRepositoryToken(Service));
    appointmentRepo = module.get(getRepositoryToken(Appointment));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAvailability', () => {
    const queryDto = { date: '2025-07-14' };

    it('should return a full list of slots when there are no appointments', async () => {
      serviceRepo.findOne.mockResolvedValue(mockService);
      appointmentRepo.find.mockResolvedValue([]);

      const result = await service.getAvailability({ serviceId: 1, date: queryDto.date });

      expect(result).toHaveLength(1);
      expect(result[0].staffId).toBe(mockStaff.id);
      // 9:00, 9:30, 10:00, 10:30, 11:00, 11:30, 12:00, 12:30, 13:00, 13:30, 14:00, 14:30, 15:00, 15:30
      // 16:00 is the last possible slot, as it ends at 17:00
      expect(result[0].availableSlots).toHaveLength(15);
      expect(result[0].availableSlots[0]).toBe('09:00');
      expect(result[0].availableSlots[13]).toBe('15:30');
    });

    it('should remove slots that conflict with an existing appointment', async () => {
      const mockAppointment: Appointment = {
        id: 1,
        staffId: mockStaff.id,
        serviceId: 1,
        // 14:00 UTC is 10:00 in New York (EDT)
        startTime: new Date('2025-07-14T14:00:00Z'),
        // 15:00 UTC is 11:00 in New York (EDT)
        endTime: new Date('2025-07-14T15:00:00Z'),
        staff: mockStaff,
        created_at: new Date(),
      };
      serviceRepo.findOne.mockResolvedValue(mockService);
      appointmentRepo.find.mockResolvedValue([mockAppointment]);

      const result = await service.getAvailability({ serviceId: 1, date: queryDto.date });

      // The appointment is from 10:00-11:00 local time.
      // The service is 60 mins.
      // Slots at 09:30 (ends 10:30), 10:00 (ends 11:00), 10:30 (ends 11:30) are blocked.
      expect(result[0].availableSlots).not.toContain('09:30');
      expect(result[0].availableSlots).not.toContain('10:00');
      expect(result[0].availableSlots).not.toContain('10:30');
      expect(result[0].availableSlots).not.toContain('11:00');
      expect(result[0].availableSlots).toContain('09:00');
      expect(result[0].availableSlots).toContain('11:30');
    });

    it('should account for buffer time after an appointment', async () => {
      const mockAppointment: Appointment = {
        id: 1,
        staffId: mockStaff.id,
        serviceId: 1,
        // 14:00 UTC is 10:00 in New York (EDT)
        startTime: new Date('2025-07-14T14:00:00Z'),
        // 15:00 UTC is 11:00 in New York (EDT)
        endTime: new Date('2025-07-14T15:00:00Z'),
        staff: mockStaff,
        created_at: new Date(),
      };
      serviceRepo.findOne.mockResolvedValue(mockService);
      appointmentRepo.find.mockResolvedValue([mockAppointment]);

      const result = await service.getAvailability({ serviceId: 1, date: queryDto.date });

      // Appointment is 10:00-11:00. With 15min buffer, it effectively blocks until 11:15.
      // Service is 60 mins.
      // 10:30 slot ends at 11:30, so it's blocked.
      // 11:00 slot ends at 12:00, so it's blocked.
      expect(result[0].availableSlots).not.toContain('10:30');
      expect(result[0].availableSlots).not.toContain('11:00');
      expect(result[0].availableSlots).toContain('11:30');
    });

    it('should return empty slots if staff is not working on the requested day', async () => {
      serviceRepo.findOne.mockResolvedValue(mockService);
      appointmentRepo.find.mockResolvedValue([]);

      // Tuesday, July 15, 2025
      const notWorkingDayQuery = { date: '2025-07-15' };
      const result = await service.getAvailability({ serviceId: 1, date: notWorkingDayQuery.date });

      expect(result[0].availableSlots).toHaveLength(0);
    });

    it('should throw NotFoundException if service does not exist', async () => {
      serviceRepo.findOne.mockResolvedValue(null);

      await expect(
        service.getAvailability({ serviceId: 999, date: queryDto.date }),
      ).rejects.toThrow(new NotFoundException('Service with ID #999 not found'));
    });
  });
});
