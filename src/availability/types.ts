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
