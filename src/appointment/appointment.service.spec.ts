import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentService } from './appointment.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { Service } from '@src/service/entities/service.entity';
import { Staff } from '@src/staff/entities/staff.entity';
import { WebhookService } from '@src/webhook/webhook.service';
import { createMockRepository, MockRepository } from '@common/types';
import { BadRequestException } from '@nestjs/common';

const mockAppointment = {
  id: 1,
  staffId: 1,
  serviceId: 1,
  startTime: new Date('2025-07-14T14:00:00Z'),
  endTime: new Date('2025-07-14T15:00:00Z'),
} as unknown as Appointment;

const mockService = {
  id: 1,
  name: 'Haircut',
} as unknown as Service;

const mockStaff = {
  id: 1,
  name: 'Jane Doe',
} as unknown as Staff;

describe('AppointmentService', () => {
  let service: AppointmentService;
  let appointmentRepo: MockRepository<Appointment>;
  let serviceRepo: MockRepository<Service>;
  let staffRepo: MockRepository<Staff>;
  let webhookService: WebhookService;

  beforeEach(async () => {
    appointmentRepo = createMockRepository();
    serviceRepo = createMockRepository();
    staffRepo = createMockRepository();
    webhookService = { sendNewAppointmentWebhook: jest.fn() } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentService,
        { provide: getRepositoryToken(Appointment), useValue: appointmentRepo },
        { provide: getRepositoryToken(Service), useValue: serviceRepo },
        { provide: getRepositoryToken(Staff), useValue: staffRepo },
        { provide: WebhookService, useValue: webhookService },
      ],
    }).compile();

    service = module.get<AppointmentService>(AppointmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAppointment', () => {
    const createDto = {
      staffId: 1,
      serviceId: 1,
      startTime: new Date('2025-07-14T14:00:00Z'),
      endTime: new Date('2025-07-14T15:00:00Z'),
    };

    it('should create and return an appointment, and call webhook', async () => {
      appointmentRepo.create.mockReturnValue(mockAppointment);
      appointmentRepo.save.mockResolvedValue(mockAppointment);
      serviceRepo.findOneBy = jest.fn().mockResolvedValue(mockService);
      staffRepo.findOneBy = jest.fn().mockResolvedValue(mockStaff);

      const result = await service.createAppointment(createDto);
      expect(result).toBe(mockAppointment);
      expect(appointmentRepo.create).toHaveBeenCalledWith(createDto);
      expect(appointmentRepo.save).toHaveBeenCalledWith(mockAppointment);
      expect(serviceRepo.findOneBy).toHaveBeenCalledWith({ id: createDto.serviceId });
      expect(staffRepo.findOneBy).toHaveBeenCalledWith({ id: createDto.staffId });
      expect(webhookService.sendNewAppointmentWebhook).toHaveBeenCalledWith(
        expect.objectContaining({
          id: mockAppointment.id,
          staffId: mockAppointment.staffId,
          serviceId: mockAppointment.serviceId,
          serviceName: mockService.name,
          staffName: mockStaff.name,
          startTime: mockAppointment.startTime,
          endTime: mockAppointment.endTime,
        }),
      );
    });

    it('should throw if service or staff not found', async () => {
      appointmentRepo.create.mockReturnValue(mockAppointment);
      appointmentRepo.save.mockResolvedValue(mockAppointment);
      serviceRepo.findOneBy = jest.fn().mockResolvedValue(null);
      staffRepo.findOneBy = jest.fn().mockResolvedValue(mockStaff);
      await expect(service.createAppointment(createDto)).rejects.toThrow(BadRequestException);

      serviceRepo.findOneBy = jest.fn().mockResolvedValue(mockService);
      staffRepo.findOneBy = jest.fn().mockResolvedValue(null);
      await expect(service.createAppointment(createDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException on repository error', async () => {
      appointmentRepo.create.mockImplementation(() => {
        throw new Error('fail');
      });
      await expect(service.createAppointment(createDto)).rejects.toThrow(BadRequestException);
    });
  });
});
