import { PaginationDto } from '@common/utils/pagination';

export type CreateStaffArg = {
  name: string;
  timezone: string;
  workingHours?: CreateWorkingHourArg[];
};

export type CreateWorkingHourArg = {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
};

export type FetchStaffsArg = {} & PaginationDto;

export type FetchStaffArg = {
  id: number;
};
