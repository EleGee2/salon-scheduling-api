export type FetchAvailabityArg = {
  serviceId: number;
  date: string;
};

export interface StaffAvailability {
  staffId: number;
  staffName: string;
  availableSlots: string[];
}
