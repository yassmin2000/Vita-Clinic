import { dosageForms, routesOfAdministration } from '@/lib/constants';

export type Lookup = {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
};

export type DosageForm = (typeof dosageForms)[number]['value'];
export type RouteOfAdministration =
  (typeof routesOfAdministration)[number]['value'];

export type Medication = {
  id: string;
  name: string;
  description?: string;
  strength: number;
  unit: string;
  dosageForm: DosageForm;
  routeOfAdministration: RouteOfAdministration;
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

export type PriceLookup = {
  id: string;
  name: string;
  price: number;
  description?: string;
  createdAt: string;
};

export type Therapy = PriceLookup & {
  unit?: string;
};

export type LaboratoryTest = {
  id: string;
  name: string;
  description?: string;
  price: number;
  biomarkers: Biomarker[];
  createdAt: string;
};
