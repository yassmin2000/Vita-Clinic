export type Lookup = {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
};

export type Medication = {
  id: string;
  name: string;
  description?: string;
  strength: number;
  unit: string;
  dosageForm:
    | 'capsule'
    | 'injection'
    | 'liquid'
    | 'suppository'
    | 'tablet'
    | 'topical';
  routeOfAdministration:
    | 'inhalation'
    | 'intramuscular'
    | 'intravenous'
    | 'nasal'
    | 'ophthalmic'
    | 'oral'
    | 'rectal'
    | 'subcutaneous'
    | 'transdermal'
    | 'vaginal';
  createdAt: string;
};

export type Biomarker = {
  id: string;
  name: string;
  unit: string;
  minimumValue: number;
  maximumValue: number;
  description?: string;
  createdAt: string;
};

export type Modality = {
  id: string;
  name: string;
  price: number;
  description?: string;
  createdAt: string;
};

export type LaboratoryTest = {
  id: string;
  name: string;
  description?: string;
  price: number;
  biomarkers: {
    id: string;
    name: string;
  }[];
  createdAt: string;
};
