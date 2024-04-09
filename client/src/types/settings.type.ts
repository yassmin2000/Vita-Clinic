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
  minimum: number;
  maximum: number;
  description?: string;
  createdAt: string;
};
