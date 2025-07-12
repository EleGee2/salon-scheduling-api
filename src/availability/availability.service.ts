import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from '@src/appointment/entities/appointment.entity';
import { Service } from '@src/service/entities/service.entity';
import { Between, Repository } from 'typeorm';
import { FetchAvailabityArg, StaffAvailability } from './types';
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
    // 1. Fetch the service with its assigned staff and their working hours
    const service = await this.serviceRepo.findOne({
      where: { id: serviceId },
      relations: ['staff', 'staff.workingHours'],
    });

    if (!service) {
      throw new NotFoundException(`Service with ID #${serviceId} not found`);
    }

    const requestedDate = parseISO(date);
    const dayOfWeek = getDay(requestedDate); // 0 for Sunday, 1 for Monday, etc.

    const availabilityPromises = service.staff.map(async (staff) => {
      const staffTimezone = staff.timezone;

      // 2. Find the staff's working hours for the specific day
      const workingHours = staff.workingHours.find((wh) => wh.dayOfWeek === dayOfWeek);
      if (!workingHours) {
        return { staffId: staff.id, staffName: staff.name, availableSlots: [] };
      }

      // 3. Define the start and end of the workday in the staff's timezone
      const workdayStartLocal = parseISO(`${date}T${workingHours.startTime}`);
      const workdayEndLocal = parseISO(`${date}T${workingHours.endTime}`);

      // 4. Fetch all existing appointments for the staff on that day, converting to their timezone
      const dayStartUTC = toZonedTime(startOfDay(requestedDate), staffTimezone);
      const dayEndUTC = fromZonedTime(endOfDay(requestedDate), staffTimezone);

      const appointments = await this.appointmentRepo.find({
        where: {
          staffId: staff.id,
          startTime: Between(dayStartUTC, dayEndUTC),
        },
      });

      // 5. Generate potential 30-minute slots
      const availableSlots: string[] = [];
      let currentSlot = workdayStartLocal;

      while (isBefore(currentSlot, workdayEndLocal)) {
        const slotEnd = addMinutes(currentSlot, service.duration);

        // A slot is valid if it doesn't exceed the end of the workday
        if (isBefore(slotEnd, workdayEndLocal) || isEqual(slotEnd, workdayEndLocal)) {
          let isSlotFree = true;

          // 6. Check for conflicts with existing appointments
          for (const app of appointments) {
            const appStartLocal = toZonedTime(app.startTime, staffTimezone);
            // Include buffer time in the appointment's effective end time
            const appEndLocalWithBuffer = addMinutes(
              toZonedTime(app.endTime, staffTimezone),
              service.buffer_time,
            );

            // Conflict check:
            // A new appointment can't start before an existing one ends (with buffer)
            // A new appointment can't end after an existing one starts
            const newAppStartsBeforeOldEnds = isBefore(currentSlot, appEndLocalWithBuffer);
            const newAppEndsAfterOldStarts = isBefore(appStartLocal, slotEnd);

            if (newAppStartsBeforeOldEnds && newAppEndsAfterOldStarts) {
              isSlotFree = false;
              break; // Conflict found, no need to check other appointments
            }
          }

          if (isSlotFree) {
            availableSlots.push(format(currentSlot, 'HH:mm'));
          }
        }

        // Move to the next 30-minute interval
        currentSlot = addMinutes(currentSlot, 30);
      }

      return { staffId: staff.id, staffName: staff.name, availableSlots };
    });

    return Promise.all(availabilityPromises);
  }
}
