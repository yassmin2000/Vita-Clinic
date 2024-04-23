export type BloodType =
  | 'a_positive'
  | 'a_negative'
  | 'b_positive'
  | 'b_negative'
  | 'ab_positive'
  | 'ab_negative'
  | 'o_positive'
  | 'o_negative';

export type PatientAllergy = {
  id: string;
  allergyId: string;
  notes?: string;
  patientReaction?: string;
  createdAt: string;
  updatedAt: string;
  allergy: {
    name: string;
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
  };
};

export type EMR = {
  id: string;
  patientId: string;
  height?: number;
  weight?: number;
  bloodType?: BloodType;
  smokingStatus?: 'never' | 'former' | 'current';
  alcoholStatus?: 'never' | 'former' | 'current';
  drugsUsage?: 'never' | 'former' | 'current';
  createdAt: string;
  updatedAt: string;
  allergies: PatientAllergy[];
  diagnoses: PatientDiagnosis[];
};
