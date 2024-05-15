import { Request } from 'express';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';

import { AppointmentsService } from './appointments.service';
import { ReportsService } from './reports/reports.service';
import { ScansService } from './scans/scans.service';
import { TreatmentService } from './treatments/treatments.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { VitalsService } from './vitals/vitals.service';
import { CreateVitalsDto, UpdateVitalsDto } from './vitals/dto/vitals.dto';
import {
  ApproveAppointmentDto,
  CompleteAppointmentDto,
  CreateAppointmentDto,
  GetAllAppointmentsQuery,
} from './dto/appointments.dto';
import type { Payload } from 'src/types/payload.type';
import { PrescriptionsService } from './prescriptions/prescriptions.service';

@Controller('appointments')
export class AppointmentsController {
  constructor(
    private readonly appointmentsService: AppointmentsService,
    private readonly reportsService: ReportsService,
    private readonly scansService: ScansService,
    private readonly treatmentService: TreatmentService,
    private readonly prescriptionsService: PrescriptionsService,
  ) {}

  @UseGuards(JwtGuard)
  @Get()
  async getAllAppointments(
    @Query(new ValidationPipe({ transform: true }))
    query: GetAllAppointmentsQuery,
    @Req() request: Request,
  ) {
    const user: Payload = request['user'];

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.appointmentsService.findAll(query, undefined, user.id);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async getAppointmentById(@Param('id') id: string, @Req() request: Request) {
    const user: Payload = request['user'];

    const appointment = await this.appointmentsService.findById(id);

    if (user.role === 'patient' && appointment.patientId !== user.id) {
      throw new UnauthorizedException();
    }

    return appointment;
  }

  @UseGuards(JwtGuard)
  @Get(':id/reports')
  async getAppointmentReportsById(
    @Param('id') id: string,
    @Req() request: Request,
  ) {
    const user: Payload = request['user'];

    const reports = await this.reportsService.findAllByAppointmentId(id);

    if (user.role === 'patient') {
      return reports.filter(
        (report) => report.appointment.patientId === user.id,
      );
    }

    return reports;
  }

  @UseGuards(JwtGuard)
  @Get(':id/treatments')
  async getAppointmentTreatmentsById(
    @Param('id') id: string,
    @Req() request: Request,
  ) {
    const user: Payload = request['user'];

    const treatments = await this.treatmentService.findAllByAppointmentId(id);

    if (user.role === 'patient') {
      return treatments.filter(
        (treatment) => treatment.appointment.patientId === user.id,
      );
    }

    return treatments;
  }

  @UseGuards(JwtGuard)
  @Get(':id/scans')
  async getAppointmentScansById(
    @Param('id') id: string,
    @Req() request: Request,
  ) {
    const user: Payload = request['user'];

    const scans = await this.scansService.findAllByAppointmentId(id);

    if (user.role === 'patient') {
      return scans.filter((scan) => scan.appointment.patientId === user.id);
    }

    return scans;
  }

  @UseGuards(JwtGuard)
  @Post()
  async createAppointment(
    @Body(new ValidationPipe({ transform: true })) dto: CreateAppointmentDto,
    @Req() request: Request,
  ) {
    const user: Payload = request['user'];

    if (user.role !== 'patient') {
      throw new UnauthorizedException();
    }

    return this.appointmentsService.create(user.id, dto);
  }

  @UseGuards(JwtGuard)
  @Patch(':id/approve')
  async approveAppointment(
    @Param('id') id: string,
    @Body(new ValidationPipe()) dto: ApproveAppointmentDto,
    @Req() request: Request,
  ) {
    const user: Payload = request['user'];

    if (user.role !== 'admin') {
      throw new UnauthorizedException();
    }

    return this.appointmentsService.approve(id, dto.doctorId);
  }

  @UseGuards(JwtGuard)
  @Patch(':id/reject')
  async rejectAppointment(@Param('id') id: string, @Req() request: Request) {
    const user: Payload = request['user'];

    if (user.role !== 'admin') {
      throw new UnauthorizedException();
    }

    return this.appointmentsService.reject(id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id/complete')
  async completeAppointment(
    @Param('id') id: string,
    @Body(new ValidationPipe()) dto: CompleteAppointmentDto,
    @Req() request: Request,
  ) {
    const user: Payload = request['user'];

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.appointmentsService.complete(id, dto.billingStatus);
  }

  @UseGuards(JwtGuard)
  @Patch(':id/cancel')
  async cancelAppointment(@Param('id') id: string, @Req() request: Request) {
    const user: Payload = request['user'];

    const appointment = await this.appointmentsService.findById(id);
    if (
      user.role !== 'admin' &&
      user.role === 'patient' &&
      appointment.patientId !== user.id
    ) {
      throw new UnauthorizedException();
    }

    return this.appointmentsService.cancel(id);
  }

  @UseGuards(JwtGuard)
  @Get(':id/prescriptions')
  async getAppointmentPrescriptionsById(
    @Param('id') id: string,
    @Req() request: Request,
  ) {
    const user: Payload = request['user'];

    const treatments =
      await this.prescriptionsService.findAllByAppointmentId(id);

    if (user.role === 'patient') {
      return treatments.filter(
        (treatment) => treatment.appointment.patientId === user.id,
      );
    }

    return treatments;
  }
}
