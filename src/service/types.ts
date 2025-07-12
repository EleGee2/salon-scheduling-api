import { PaginationDto } from '@common/utils/pagination';

export type CreateServiceArg = {
  name: string;
  duration: number;
  price: number;
  buffer_time: number;
};

export type FetchServicesArg = {} & PaginationDto;

export type FetchServiceArg = {
  id: number;
};

export type UpdateServiceArg = {
  id: number;
  name?: string;
  duration?: number;
  price?: number;
  buffer_time?: number;
};

export type AssignStaffArg = {
  serviceId: number;
  staffIds: number[];
};

export type FetchAssignedStaffArg = {
  serviceId: number;
};

export type FetchAvailabityArg = {
  serviceId: number;
  date: string;
};

export interface StaffAvailability {
  staffId: number;
  staffName: string;
  availableSlots: string[];
}
