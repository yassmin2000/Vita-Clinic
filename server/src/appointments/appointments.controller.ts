import type { Request } from 'express';
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
import { PrescriptionsService } from './prescriptions/prescriptions.service';
import { TestResultsService } from './test-results/test-results.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

import {
  AppointmentDto,
  AppointmentListItemDto,
  ApproveAppointmentDto,
  BasicAppointmentDto,
  CompleteAppointmentDto,
  CreateAppointmentDto,
  GetAllAppointmentsQuery,
} from './dto/appointments.dto';
import { ReportDto } from './reports/dto/reports.dto';
import { ScanDto } from './scans/dto/scans.dto';
import { PrescriptionDto } from './prescriptions/dto/prescriptions.dto';
import { FullTreatmentDto } from './treatments/dto/treatments.dto';
import { FullLaboratoryTestResultDto } from './test-results/dto/test-results.dto';
import { ApiDocumentation } from 'src/decorators/documentation.decorator';

@ApiDocumentation({
  tags: 'Appointments',
  security: 'bearer',
  unauthorizedResponse: {
    description: 'Unauthorized',
  },
  badRequestResponse: {
    description: 'Bad Request',
  },
})
@UseGuards(JwtGuard)
@Controller('appointments')
export class AppointmentsController {
  constructor(
    private readonly appointmentsService: AppointmentsService,
    private readonly reportsService: ReportsService,
    private readonly scansService: ScansService,
    private readonly treatmentService: TreatmentService,
    private readonly prescriptionsService: PrescriptionsService,
    private readonly testResultsService: TestResultsService,
  ) {}

  @ApiDocumentation({
    operation: {
      summary: 'Get all appointments',
      description: 'Get all appointments',
    },
    okResponse: {
      description: 'Appointments data',
      type: [AppointmentListItemDto],
    },
  })
  @Get()
  async getAllAppointments(
    @Query(new ValidationPipe({ transform: true }))
    query: GetAllAppointmentsQuery,
    @Req() request: Request,
  ): Promise<AppointmentListItemDto[]> {
    const user = request.user;

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.appointmentsService.findAll(query, undefined, user.id);
  }

  @ApiDocumentation({
    operation: {
      summary: 'Get appointment by ID',
      description: 'Get certain appointment data by ID',
    },
    params: {
      name: 'appointmentId',
      type: String,
      description: 'Appointment ID',
      example: crypto.randomUUID(),
    },
    notFoundResponse: {
      description: 'Appointment not found',
    },
    okResponse: {
      description: 'Appointment data',
      type: AppointmentDto,
    },
  })
  @Get(':appointmentId')
  async getAppointmentById(
    @Param('appointmentId') appointmentId: string,
    @Req() request: Request,
  ): Promise<AppointmentDto> {
    const user = request.user;

    const appointment = await this.appointmentsService.findById(appointmentId);

    if (user.role === 'patient' && appointment.patientId !== user.id) {
      throw new UnauthorizedException();
    }

    return appointment;
  }

  @ApiDocumentation({
    operation: {
      summary: 'Get reports by appointment ID',
      description: 'Get all reports for an appointment by ID',
    },
    params: {
      name: 'appointmentId',
      type: String,
      description: 'Appointment ID',
      example: crypto.randomUUID(),
    },
    notFoundResponse: {
      description: 'Appointment not found',
    },
    okResponse: {
      description: 'Reports data',
      type: [ReportDto],
    },
  })
  @Get(':appointmentId/reports')
  async getAppointmentReportsById(
    @Param('appointmentId') appointmentId: string,
    @Req() request: Request,
  ): Promise<ReportDto[]> {
    const user = request.user;

    const reports =
      await this.reportsService.findAllByAppointmentId(appointmentId);

    if (user.role === 'patient') {
      return reports.filter(
        (report) => report.appointment.patientId === user.id,
      );
    }

    return reports;
  }

  @ApiDocumentation({
    operation: {
      summary: 'Get scans by appointment ID',
      description: 'Get all scans for an appointment by ID',
    },
    params: {
      name: 'appointmentId',
      type: String,
      description: 'Appointment ID',
      example: crypto.randomUUID(),
    },
    notFoundResponse: {
      description: 'Appointment not found',
    },
    okResponse: {
      description: 'Scans data',
      type: [ScanDto],
    },
  })
  @Get(':appointmentId/scans')
  async getAppointmentScansById(
    @Param('appointmentId') appointmentId: string,
    @Req() request: Request,
  ): Promise<ScanDto[]> {
    const user = request.user;

    const scans = await this.scansService.findAllByAppointmentId(appointmentId);

    if (user.role === 'patient') {
      return scans.filter((scan) => scan.appointment.patientId === user.id);
    }

    return scans;
  }

  @ApiDocumentation({
    operation: {
      summary: 'Get treatments by appointment ID',
      description: 'Get all treatments for an appointment by ID',
    },
    params: {
      name: 'appointmentId',
      type: String,
      description: 'Appointment ID',
      example: crypto.randomUUID(),
    },
    notFoundResponse: {
      description: 'Appointment not found',
    },
    okResponse: {
      description: 'Treatments data',
      type: [FullTreatmentDto],
    },
  })
  @Get(':appointmentId/treatments')
  async getAppointmentTreatmentsById(
    @Param('appointmentId') appointmentId: string,
    @Req() request: Request,
  ): Promise<FullTreatmentDto[]> {
    const user = request.user;

    const treatments =
      await this.treatmentService.findAllByAppointmentId(appointmentId);

    if (user.role === 'patient') {
      return treatments.filter(
        (treatment) => treatment.appointment.patientId === user.id,
      );
    }

    return treatments;
  }

  @ApiDocumentation({
    operation: {
      summary: 'Get prescriptions by appointment ID',
      description: 'Get all prescriptions for an appointment by ID',
    },
    params: {
      name: 'appointmentId',
      type: String,
      description: 'Appointment ID',
      example: crypto.randomUUID(),
    },
    notFoundResponse: {
      description: 'Appointment not found',
    },
    okResponse: {
      description: 'Prescriptions data',
      type: [PrescriptionDto],
    },
  })
  @Get(':appointmentId/prescriptions')
  async getAppointmentPrescriptionsById(
    @Param('appointmentId') appointmentId: string,
    @Req() request: Request,
  ): Promise<PrescriptionDto[]> {
    const user = request.user;

    const prescriptions =
      await this.prescriptionsService.findAllByAppointmentId(appointmentId);

    if (user.role === 'patient') {
      return prescriptions.filter(
        (treatment) => treatment.appointment.patientId === user.id,
      );
    }

    return prescriptions;
  }

  @ApiDocumentation({
    operation: {
      summary: 'Get test results by appointment ID',
      description: 'Get all test results for an appointment by ID',
    },
    params: {
      name: 'appointmentId',
      type: String,
      description: 'Appointment ID',
      example: crypto.randomUUID(),
    },
    notFoundResponse: {
      description: 'Appointment not found',
    },
    okResponse: {
      description: 'Test results data',
      type: [FullLaboratoryTestResultDto],
    },
  })
  @Get(':appointmentId/test-results')
  async getAppointmentTestResultsById(
    @Param('appointmentId') appointmentId: string,
    @Req() request: Request,
  ) {
    const user = request.user;

    const testResults =
      await this.testResultsService.findAllByAppointmentId(appointmentId);

    if (user.role === 'patient') {
      return testResults.filter(
        (testResult) => testResult.appointment.patientId === user.id,
      );
    }

    return testResults;
  }

  @ApiDocumentation({
    operation: {
      summary: 'Create an appointment',
      description: 'Create an appointment',
    },
    body: {
      description: 'Appointment data',
      type: CreateAppointmentDto,
    },
    consumes: 'application/json',
    unprocessableEntityResponse: {
      description: 'Invalid date',
    },
    notFoundResponse: {
      description: 'EMR not found',
    },
    createdResponse: {
      description: 'Appointment created',
      type: AppointmentDto,
    },
  })
  @Post()
  async createAppointment(
    @Body(new ValidationPipe({ transform: true })) dto: CreateAppointmentDto,
    @Req() request: Request,
  ) {
    const user = request.user;

    if (user.role !== 'patient') {
      throw new UnauthorizedException();
    }

    return this.appointmentsService.create(user.id, dto);
  }

  @ApiDocumentation({
    operation: {
      summary: 'Approve an appointment',
      description: 'Approve an appointment',
    },
    params: {
      name: 'appointmentId',
      type: String,
      description: 'Appointment ID',
      example: crypto.randomUUID(),
    },
    body: {
      description: 'Appointment approval data',
      type: ApproveAppointmentDto,
    },
    consumes: 'application/json',
    notFoundResponse: {
      description: 'Appointment/Doctor not found',
    },
    conflictResponse: {
      description: 'Appointment is not pending',
    },
    okResponse: {
      description: 'Appointment approved',
      type: BasicAppointmentDto,
    },
  })
  @Patch(':appointmentId/approve')
  async approveAppointment(
    @Param('appointmentId') appointmentId: string,
    @Body(new ValidationPipe()) dto: ApproveAppointmentDto,
    @Req() request: Request,
  ): Promise<BasicAppointmentDto> {
    const user = request.user;

    if (user.role !== 'admin') {
      throw new UnauthorizedException();
    }

    return this.appointmentsService.approve(
      appointmentId,
      dto.doctorId,
      user.id,
    );
  }

  @ApiDocumentation({
    operation: {
      summary: 'Reject an appointment',
      description: 'Reject an appointment',
    },
    params: {
      name: 'appointmentd',
      type: String,
      description: 'Appointment ID',
      example: crypto.randomUUID(),
    },
    notFoundResponse: {
      description: 'Appointment not found',
    },
    conflictResponse: {
      description: 'Appointment is not pending',
    },
    okResponse: {
      description: 'Appointment rejected',
      type: BasicAppointmentDto,
    },
  })
  @Patch(':appointmentd/reject')
  async rejectAppointment(
    @Param('appointmentd') appointmentd: string,
    @Req() request: Request,
  ): Promise<BasicAppointmentDto> {
    const user = request.user;

    if (user.role !== 'admin') {
      throw new UnauthorizedException();
    }

    return this.appointmentsService.reject(appointmentd, user.id);
  }

  @ApiDocumentation({
    operation: {
      summary: 'Complete an appointment',
      description: 'Complete an appointment',
    },
    params: {
      name: 'appointmentId',
      type: String,
      description: 'Appointment ID',
      example: crypto.randomUUID(),
    },
    body: {
      description: 'Appointment completion data',
      type: CompleteAppointmentDto,
    },
    consumes: 'application/json',
    notFoundResponse: {
      description: 'Appointment not found',
    },
    conflictResponse: {
      description: 'Appointmnet is not approved',
    },
    okResponse: {
      description: 'Appointment completed',
      type: BasicAppointmentDto,
    },
  })
  @Patch(':appointmentId/complete')
  async completeAppointment(
    @Param('appointmentId') appointmentId: string,
    @Body(new ValidationPipe()) dto: CompleteAppointmentDto,
    @Req() request: Request,
  ) {
    const user = request.user;

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.appointmentsService.complete(
      appointmentId,
      dto.billingStatus,
      user.id,
    );
  }

  @ApiDocumentation({
    operation: {
      summary: 'Cancel an appointment',
      description: 'Cancel an appointment',
    },
    params: {
      name: 'appointmentId',
      type: String,
      description: 'Appointment ID',
      example: crypto.randomUUID(),
    },
    notFoundResponse: {
      description: 'Appointment not found',
    },
    conflictResponse: {
      description: 'Appointment is not approved',
    },
    okResponse: {
      description: 'Appointment canceled',
      type: BasicAppointmentDto,
    },
  })
  @Patch(':appointmentId/cancel')
  async cancelAppointment(
    @Param('appointmentId') appointmentId: string,
    @Req() request: Request,
  ) {
    const user = request.user;

    const appointment = await this.appointmentsService.findById(appointmentId);
    if (
      user.role !== 'admin' &&
      user.role === 'patient' &&
      appointment.patientId !== user.id
    ) {
      throw new UnauthorizedException();
    }

    return this.appointmentsService.cancel(appointmentId, user.id);
  }
}
