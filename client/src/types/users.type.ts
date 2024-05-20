import type { BloodType, Insurance } from './emr.type';

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  ssn: string;
  phoneNumber: string;
  address: string;
  birthDate: string;
  sex: 'male' | 'female';
  createdAt: string;
  avatarURL: string;
  isActive: boolean;
};

export type Admin = User & {
  isSuperAdmin: boolean;
};

export type Doctor = User & {
  speciality?: {
    id: string;
    name: string;
  };
};

export type Patient = User & {
  emr?: {
    id: string;
    bloodType?: BloodType;
    insurance?: Insurance;
  };
};

export type Profile = User & {
  role: 'admin' | 'doctor' | 'patient';
  isSuperAdmin?: boolean;
  speciality?: string;
  emrId?: string;
  insurance?: Insurance;
  appointments: number;
  reports: number;
  scans: number;
  prescriptions: number;
  treatments: number;
  laboratoryTestResults: number;
};
