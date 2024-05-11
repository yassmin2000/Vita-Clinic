import type { BloodType, Insurance } from './emr.type';

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
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
