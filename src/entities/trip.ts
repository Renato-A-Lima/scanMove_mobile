import type { TripStatus } from './types';

export type Trip = {
  id: string;
  company: string;
  city: string;
  date: string;
  status: TripStatus;
};
