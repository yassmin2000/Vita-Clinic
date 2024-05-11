import type { DosageForm, RouteOfAdministration } from './settings.type';

export type BloodType =
  | 'a_positive'
  | 'a_negative'
  | 'b_positive'
  | 'b_negative'
  | 'ab_positive'
  | 'ab_negative'
  | 'o_positive'
  | 'o_negative';

export type Frequency = 'daily' | 'weekly' | 'monthly' | 'yearly';

export type Insurance = {
  id: string;
  provider: string;
  policyNumber: string;
  policyStartDate: string;
  policyEndDate: string;
  createdAt: string;
  updatedAt: string;
};

export type PatientAllergy = {
  id: string;
  allergyId: string;
  notes?: string;
  patientReaction?: string;
  createdAt: string;
  updatedAt: string;
  allergy: {
    name: string;
    description?: string;
  };
};

export type PatientDiagnosis = {
  id: string;
  diagnosisId: string;
  notes?: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  diagnosis: {
    name: string;
    description?: string;
  };
};

export type PatientMedicalCondition = {
  id: string;
  medicalConditionId: string;
  notes?: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  medicalCondition: {
    name: string;
    description?: string;
  };
};

export type PatientSurgery = {
  id: string;
  surgeryId: string;
  notes?: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  surgery: {
    name: string;
    description?: string;
  };
};

export type PatientMedication = {
  id: string;
  medicationId: string;
  notes?: string;
  startDate?: string;
  endDate?: string;
  dosage?: number;
  frequency?: Frequency;
  required: boolean;
  createdAt: string;
  updatedAt: string;
  medication: {
    name: string;
    unit: string;
    description?: string;
    dosageForm: DosageForm;
    routeOfAdministration: RouteOfAdministration;
  };
};

export type EMR = {
  id: string;
  patientId: string;
  patient: {
    firstName: string;
    lastName: string;
    birthDate: string;
    sex: 'male' | 'female';
    avatarURL?: string;
  };
  height?: number;
  weight?: number;
  bloodType?: BloodType;
  smokingStatus?: 'never' | 'former' | 'current';
  alcoholStatus?: 'never' | 'former' | 'current';
  drugsUsage?: 'never' | 'former' | 'current';
  insurance?: Insurance;
  createdAt: string;
  updatedAt: string;
  allergies: PatientAllergy[];
  diagnoses: PatientDiagnosis[];
  medicalConditions: PatientMedicalCondition[];
  surgeries: PatientSurgery[];
  medications: PatientMedication[];
};
