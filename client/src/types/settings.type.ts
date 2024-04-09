export type Lookup = {
  id: string;
  name: string;
  description?: string;
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
