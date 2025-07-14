import { Appointment } from '@src/appointment/entities/appointment.entity';
import { Service } from '@src/service/entities/service.entity';
import { Staff } from '@src/staff/entities/staff.entity';

export type FetchAvailabityArg = {
  serviceId: number;
  date: string;
};

export interface StaffAvailability {
  staffId: number;
  staffName: string;
  availableSlots: string[];
}

export interface WorkdayBounds {
  start: Date;
  end: Date;
}

export type FindServiceWithRelationsArg = {
  serviceId: number;
};

export type GetWorkdayBoundsArg = {
  staff: Staff;
  date: Date;
};

export type FetchAppointmentsForDayArg = {
  staff: Staff;
  date: Date;
};

export type GenerateAvailableSlots = {
  workday: WorkdayBounds;
  appointments: Appointment[];
  service: Service;
};

export type IsSlotFreeArg = {
  slotStart: Date;
  slotEnd: Date;
  appointments: Appointment[];
  service: Service;
};
