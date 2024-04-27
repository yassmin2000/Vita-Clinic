import {
  IsNotEmpty,
  IsString,
  IsDateString,
  IsOptional,
  IsIn,
  IsInt,
  ArrayUnique,
} from 'class-validator';
import { Transform } from 'class-transformer';

import type { AppointmentStatus } from '@prisma/client';

export class CreateAppointmentDto {
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString({ each: true })
  service?: string;

  @IsOptional()
  @IsString({ each: true })
  therapy?: string;

  @ArrayUnique()
  @IsString({ each: true })
  scans: string[];

  @ArrayUnique()
  @IsString({ each: true })
  labWorks: string[];
}

export class GetAllAppointmentsQuery {
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  page?: number;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  limit?: number;

  @IsOptional()
  @IsIn(['all', 'pending', 'rejected', 'approved', 'completed', 'cancelled'])
  @Transform(({ value }) => value.toLowerCase(), { toClassOnly: true })
  status?: 'all' | AppointmentStatus;

  @IsOptional()
  @IsString()
  value?: string;

  @IsOptional()
  @IsIn([
    'date-desc',
    'date-asc',
    'patientName-asc',
    'patientName-desc',
    'doctorName-asc',
    'doctorName-desc',
    'bookingDate-desc',
    'bookingDate-asc',
  ])
  sort?:
    | 'date-desc'
    | 'date-asc'
    | 'patientName-asc'
    | 'patientName-desc'
    | 'doctorName-asc'
    | 'doctorName-desc'
    | 'bookingDate-desc'
    | 'bookingDate-asc';
}
