import { AppointmentStatus } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsDateString, IsIn, IsNumber, IsOptional } from 'class-validator';

export class GetInvoicesDataQuery {
  @IsOptional()
  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsDateString()
  endDate: string;
}

export class GetAppointmentsDataQuery {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  year: number;

  @IsOptional()
  @IsIn(['all', 'completed', 'approved', 'pending', 'rejected', 'cancelled'])
  status: AppointmentStatus | 'all';
}
