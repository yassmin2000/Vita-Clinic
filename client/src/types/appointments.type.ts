import { LaboratoryTest, PriceLookup } from './settings.type';

export type AppointmentStatus =
  | 'completed'
  | 'pending'
  | 'cancelled'
  | 'rejected'
  | 'approved';

export type Appointment = {
  id: string;
  number: number;
  date: string;
  doctorId?: string;
  patientId: string;
  electronicMedicalRecordId: string;
  status: AppointmentStatus;
  patient: {
    id: string;
    firstName: string;
    lastName: string;
  };
  doctor?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type Report = {
  id: string;
  appointmentId: string;
  title: string;
  status: 'initial' | 'processed' | 'failed';
  description?: string;
  fileName: string;
  reportURL: string;
  createdAt: string;
};

export type Message = {
  id: string;
  reportId: string;
  message: string;
  isUserMessage: boolean;
  createdAt: string;
};

export type Scan = {
  id: string;
  appointmentId: string;
  title: string;
  description: string;
  modality: {
    id: string;
    name: string;
  };
  scanURLs: string[];
  createdAt: string;
};

export type Billing = {
  id: string;
  date: string;
  amount: number;
  status: string;
};

export type AppointmentDetails = Appointment & {
  services: {
    service?: PriceLookup;
    therapy?: PriceLookup;
    scans: PriceLookup[];
    labWorks: LaboratoryTest[];
  };
  billing: Billing;
};
