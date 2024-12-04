import type {
  Biomarker,
  LaboratoryTest,
  PriceLookup,
  Therapy,
} from './settings.type';
import type { Insurance, PatientMedication } from './emr.type';

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
  emr?: {
    insurance?: Insurance;
  };
  createdAt: string;
  updatedAt: string;
};

export type Report = {
  id: string;
  appointmentId: string;
  title: string;
  status: 'initial' | 'processed' | 'failed';
  notes?: string;
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

export type Study = {
  id: string;
  studyInstanceUID: string;
  description: string;
  modalities: string[];
  scanId: string;
  createdAt: string;
  updatedAt: string;
  series: Series[];
};

export type Series = {
  id: string;
  seriesInstanceUID: string;
  seriesNumber: number;
  modality?: string;
  description: string;
  breastLaterality?: 'r' | 'l';
  breastView?: 'cc' | 'mlo';
  studyId: string;
  createdAt: string;
  updatedAt: string;
  instances: Instance[];
};

export type Instance = {
  id: string;
  sopInstanceUID: string;
  instanceNumber: number;
  url: string;
  seriesId: string;
  createdAt: string;
  updatedAt: string;
};

export type Scan = {
  id: string;
  appointmentId: string;
  title: string;
  notes: string;
  modality: PriceLookup;
  createdAt: string;
  study: Study;
};

export type Prescription = PatientMedication & {
  appointmentId: string;
};

export type Treatment = {
  id: string;
  appointmentId: string;
  name: string;
  dosage: number;
  duration: number;
  therapy: Therapy;
  response?: string;
  sideEffect?: string;
  notes?: string;
  createdAt: string;
};

export type TestResult = {
  id: string;
  appointmentId: string;
  title: string;
  notes?: string;
  laboratoryTestId: string;
  laboratoryTest: LaboratoryTest;
  values: {
    id: string;
    value: number;
    biomarker: Biomarker;
  }[];
  createdAt: string;
};

export type BillingStatus = 'initial' | 'cancelled' | 'paid' | 'insurance';

export type Billing = {
  id: string;
  number: number;
  date: string;
  amount: number;
  status: BillingStatus;
};

export type Vitals = {
  id: string;
  temperature?: number;
  systolicBloodPressure?: number;
  diastolicBloodPressure?: number;
  heartRate?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  createdAt: string;
  updatedAt: string;
};

export type AppointmentDetails = Appointment & {
  services: {
    service?: PriceLookup;
    therapy?: PriceLookup;
    scans: PriceLookup[];
    labWorks: LaboratoryTest[];
  };
  billing: Billing;
  vitals: Vitals;
};
