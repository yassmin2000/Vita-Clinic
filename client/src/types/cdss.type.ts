import type { Instance, Scan, Series, Study } from './appointments.type';

export enum PredictionStatus {
  pending = 'pending',
  predicted = 'predicted',
  approved = 'approved',
  rejected = 'rejected',
  failed = 'failed',
}

export enum PredictionModel {
  brain_mri = 'brain_mri',
  lung_ct = 'lung_ct',
}

export type Prediction = {
  id: string;
  userId: string;
  instanceId: string;
  status: PredictionStatus;
  model: PredictionModel;
  result: string;
  probability: number;
  comments?: string;
  instance: Instance & {
    series: Omit<Series, 'instances'> & {
      study: Omit<Study, 'series'> & {
        scan: Omit<Scan, 'study'>;
      };
    };
  };
  createdAt: string;
  updatedAt: string;
};
