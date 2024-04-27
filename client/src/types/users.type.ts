import type { BloodType } from './emr.type';

export type Admin = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  sex: 'male' | 'female';
  isSuperAdmin: boolean;
  createdAt: string;
  avatarURL: string;
};

export type Doctor = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  sex: 'male' | 'female';
  speciality?: {
    id: string;
    name: string;
  };
  createdAt: string;
  avatarURL: string;
};

export type Patient = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  sex: 'male' | 'female';
  createdAt: string;
  avatarURL: string;
  emr?: {
    id: string;
    bloodType?: BloodType;
  };
};
