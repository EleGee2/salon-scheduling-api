import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from '@src/appointment/entities/appointment.entity';
import { Service } from '@src/service/entities/service.entity';
import { Between, Repository } from 'typeorm';
import {
  FetchAppointmentsForDayArg,
  FetchAvailabityArg,
  FindServiceWithRelationsArg,
  GenerateAvailableSlots,
  GetWorkdayBoundsArg,
  IsSlotFreeArg,
  StaffAvailability,
  WorkdayBounds,
} from './types';
import {
  addMinutes,
  endOfDay,
  getDay,
  isBefore,
  isEqual,
  parseISO,
  startOfDay,
  format,
} from 'date-fns';
import { toZonedTime, fromZonedTime } from 'date-fns-tz';

@Injectable()
export class AvailabilityService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepo: Repository<Service>,
    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,
  ) {}

  async getAvailability(data: FetchAvailabityArg): Promise<StaffAvailability[]> {
    const { date, serviceId } = data;
    const service = await this.findServiceWithRelations({ serviceId });
    const requestedDate = parseISO(date);

    const availabilityPromises = service.staff.map(async (staff) => {
      const workday = this.getWorkdayBounds({ staff, date: requestedDate });
      if (!workday) {
        return { staffId: staff.id, staffName: staff.name, availableSlots: [] };
      }

      const appointments = await this.fetchAppointmentsForDay({ staff, date: requestedDate });
      const availableSlots = this.generateAvailableSlots({ workday, appointments, service });

      return { staffId: staff.id, staffName: staff.name, availableSlots };
    });

    return Promise.all(availabilityPromises);
  }

  /**
   * Fetches the service and its required relations from the database.
   * @throws {NotFoundException} if the service is not found.
   */
  private async findServiceWithRelations(data: FindServiceWithRelationsArg): Promise<Service> {
    const service = await this.serviceRepo.findOne({
      where: { id: data.serviceId },
      relations: ['staff', 'staff.workingHours'],
    });
    if (!service) {
      throw new NotFoundException(`service not found`);
    }
    return service;
  }

  /**
   * Determines the start and end of a staff member's workday in their local timezone.
   * @returns The start and end Date objects, or null if they are not working.
   */
  private getWorkdayBounds(data: GetWorkdayBoundsArg): WorkdayBounds | null {
    const dayOfWeek = getDay(data.date);
    const workingHours = data.staff.workingHours.find((wh) => wh.dayOfWeek === dayOfWeek);

    if (!workingHours) {
      return null;
    }

    const dateString = format(data.date, 'yyyy-MM-dd');
    const start = parseISO(`${dateString}T${workingHours.startTime}`);
    const end = parseISO(`${dateString}T${workingHours.endTime}`);

    return { start, end };
  }

  /**
   * Fetches all appointments for a given staff member on a specific day.
   */
  private async fetchAppointmentsForDay(data: FetchAppointmentsForDayArg): Promise<Appointment[]> {
    const { staff, date } = data;
    const dayStartUTC = fromZonedTime(startOfDay(date), staff.timezone);
    const dayEndUTC = fromZonedTime(endOfDay(date), staff.timezone);

    return this.appointmentRepo.find({
      where: {
        staffId: staff.id,
        startTime: Between(dayStartUTC, dayEndUTC),
      },
    });
  }

  /**
   * Generates a list of available 30-minute time slots.
   */
  private generateAvailableSlots(data: GenerateAvailableSlots): string[] {
    const { workday, appointments, service } = data;
    const availableSlots: string[] = [];
    let currentSlot = workday.start;

    while (isBefore(currentSlot, workday.end)) {
      const slotEnd = addMinutes(currentSlot, service.duration);

      if (isBefore(slotEnd, workday.end) || isEqual(slotEnd, workday.end)) {
        if (this.isSlotFree({ slotStart: currentSlot, slotEnd, appointments, service })) {
          availableSlots.push(format(currentSlot, 'HH:mm'));
        }
      }
      currentSlot = addMinutes(currentSlot, 30);
    }
    return availableSlots;
  }

  /**
   * Checks if a single time slot conflicts with any existing appointments, including buffer time.
   * This is the core conflict-detection logic.
   */
  private isSlotFree(data: IsSlotFreeArg): boolean {
    const { slotStart, slotEnd, appointments, service } = data;
    for (const app of appointments) {
      const appStartLocal = toZonedTime(app.startTime, service.staff[0].timezone);
      const appEndLocalWithBuffer = addMinutes(
        toZonedTime(app.endTime, service.staff[0].timezone),
        service.buffer_time,
      );

      // Conflict check:
      // A new appointment can't start before an existing one ends (with buffer)
      // A new appointment can't end after an existing one starts
      const newAppStartsBeforeOldEnds = isBefore(slotStart, appEndLocalWithBuffer);
      const newAppEndsAfterOldStarts = isBefore(appStartLocal, slotEnd);

      if (newAppStartsBeforeOldEnds && newAppEndsAfterOldStarts) {
        return false; // Conflict found
      }
    }
    return true;
  }
}
