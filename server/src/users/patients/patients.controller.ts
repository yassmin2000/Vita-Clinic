import type { Request } from 'express';
import {
  Body,
  Controller,
  Delete,
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

import { UsersService } from '../users.service';
import { PatientsService } from './patients.service';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { ReportsService } from 'src/appointments/reports/reports.service';
import { ScansService } from 'src/appointments/scans/scans.service';
import { TreatmentService } from 'src/appointments/treatments/treatments.service';
import { PrescriptionsService } from 'src/appointments/prescriptions/prescriptions.service';
import { TestResultsService } from 'src/appointments/test-results/test-results.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

import {
  CreateInsuranceDto,
  GetAllUsersQuery,
  UpdateInsuranceDto,
} from '../dto/users.dto';
import { GetAllAppointmentsQuery } from 'src/appointments/dto/appointments.dto';
import {
  BasicReportDto,
  GetPatientReportsQuery,
} from 'src/appointments/reports/dto/reports.dto';
import {
  GetPatientTreatmentsQuery,
  TreatmentDto,
} from 'src/appointments/treatments/dto/treatments.dto';
import {
  GetPatientScansQuery,
  ScanDto,
} from 'src/appointments/scans/dto/scans.dto';
import { GetPatientPrescriptionsQuery } from 'src/appointments/prescriptions/dto/prescriptions.dto';
import {
  GetPatientTestResultsQuery,
  LaboratoryTestResultDto,
} from 'src/appointments/test-results/dto/test-results.dto';
import { UserListItemDto } from '../dto/users-response.dto';
import { InsuranceDto } from './dto/patients.dto';
import { ApiDocumentation } from 'src/decorators/documentation.decorator';

@ApiDocumentation({
  tags: 'Patients',
  security: 'bearer',
  unauthorizedResponse: {
    description: 'Unauthorized',
  },
  badRequestResponse: {
    description: 'Bad Request',
  },
})
@UseGuards(JwtGuard)
@Controller('/users/patients')
export class PatientsController {
  constructor(
    private readonly usersService: UsersService,
    private readonly patientsService: PatientsService,
    private readonly appointmentsService: AppointmentsService,
    private readonly reportsService: ReportsService,
    private readonly scansService: ScansService,
    private readonly treatmentService: TreatmentService,
    private readonly prescriptionsService: PrescriptionsService,
    private readonly testResultsService: TestResultsService,
  ) {}

  @ApiDocumentation({
    operation: {
      summary: 'Get all patients',
      description: 'Get all patients data',
    },
    okResponse: {
      description: 'Patients data',
      type: [UserListItemDto],
    },
  })
  @Get()
  async getAllPatients(
    @Req() request: Request,
    @Query(new ValidationPipe({ transform: true }))
    query: GetAllUsersQuery,
  ) {
    const user = request.user;

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.usersService.findAll(user.isSuperAdmin, 'patient', {
      ...query,
    });
  }

  @ApiDocumentation({
    operation: {
      summary: 'Get patient insurance',
      description: 'Get patient insurance by id',
    },
    params: {
      name: 'patientId',
      type: String,
      description: 'Patient ID',
      example: crypto.randomUUID(),
    },
    notFoundResponse: {
      description: 'Insurance not found',
    },
    okResponse: {
      description: 'Patient insurance',
      type: InsuranceDto,
    },
  })
  @Get(':patientId/insurance')
  async getPatientInsurance(
    @Param('patientId') patientId: string,
    @Req() request: Request,
  ) {
    const user = request.user;

    if (user.role === 'patient' && user.id !== patientId) {
      throw new UnauthorizedException();
    }

    return this.patientsService.getInsurance(patientId);
  }

  @ApiDocumentation({
    operation: {
      summary: 'Create patient insurance',
      description: 'Create new patient insurance',
    },
    params: {
      name: 'patientId',
      type: String,
      description: 'Patient ID',
      example: crypto.randomUUID(),
    },
    body: {
      description: 'Insurance data',
      type: CreateInsuranceDto,
    },
    consumes: 'application/json',
    notFoundResponse: {
      description: 'Patient not found',
    },
    conflictResponse: {
      description: 'Patient already has insurance',
    },
    createdResponse: {
      description: 'New patient insurance created',
      type: InsuranceDto,
    },
  })
  @Post(':patientId/insurance')
  async createPatientInsurance(
    @Param('patientId') patientId: string,
    @Req() request: Request,
    @Body(new ValidationPipe())
    dto: CreateInsuranceDto,
  ) {
    const user = request.user;

    if (user.role !== 'admin') {
      throw new UnauthorizedException();
    }

    return this.patientsService.craeteInsurance(patientId, dto, user.id);
  }

  @ApiDocumentation({
    operation: {
      summary: 'Update patient insurance',
      description: 'Update patient insurance by id',
    },
    params: {
      name: 'patientId',
      type: String,
      description: 'Patient ID',
      example: crypto.randomUUID(),
    },
    body: {
      description: 'Insurance data',
      type: UpdateInsuranceDto,
    },
    consumes: 'application/json',
    notFoundResponse: {
      description: 'Patient/Insurance not found',
    },
    okResponse: {
      description: 'Patient insurance updated',
      type: InsuranceDto,
    },
  })
  @Patch(':patientId/insurance')
  async updatePatientInsurance(
    @Param('patientId') patientId: string,
    @Req() request: Request,
    @Body(new ValidationPipe())
    dto: UpdateInsuranceDto,
  ) {
    const user = request.user;

    if (user.role !== 'admin') {
      throw new UnauthorizedException();
    }

    return this.patientsService.updateInsurance(patientId, dto, user.id);
  }

  @ApiDocumentation({
    operation: {
      summary: 'Delete patient insurance',
      description: 'Delete patient insurance by id',
    },
    params: {
      name: 'patientId',
      type: String,
      description: 'Patient ID',
      example: crypto.randomUUID(),
    },
    notFoundResponse: {
      description: 'Patient/Insurance not found',
    },
    okResponse: {
      description: 'Insurance deleted',
      type: InsuranceDto,
    },
  })
  @Delete(':patientId/insurance')
  async deletePatientInsurance(
    @Param('patientId') patientId: string,
    @Req() request: Request,
  ) {
    const user = request.user;

    if (!user.isSuperAdmin) {
      throw new UnauthorizedException();
    }

    return this.patientsService.deleteInsurance(patientId, user.id);
  }

  @ApiDocumentation({
    operation: {
      summary: 'Get current patient appointments',
      description: 'Get current patient appointments (If patient is logged in)',
    },
    okResponse: {
      description: 'All patient appointments',
    },
  })
  @Get('/appointments')
  async getPatientsAppointments(
    @Query(new ValidationPipe({ transform: true }))
    query: GetAllAppointmentsQuery,
    @Req() request: Request,
  ) {
    const user = request.user;

    if (user.role !== 'patient') {
      throw new UnauthorizedException();
    }

    return this.appointmentsService.findAll(query, user.id);
  }

  @ApiDocumentation({
    operation: {
      summary: 'Get current patient appointments',
      description: 'Get current patient appointments (If patient is logged in)',
    },
    params: {
      name: 'patientId',
      type: String,
      description: 'Patient ID',
      example: crypto.randomUUID(),
    },
    notFoundResponse: {
      description: 'Patient not found',
    },
    okResponse: {
      description: 'All patient appointments',
    },
  })
  @Get(':patientId/appointments')
  async getPatientsAppointmentsById(
    @Param('patientId') patientId: string,
    @Query(new ValidationPipe({ transform: true }))
    query: GetAllAppointmentsQuery,
    @Req() request: Request,
  ) {
    const user = request.user;

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.appointmentsService.findAll(query, patientId);
  }

  @ApiDocumentation({
    operation: {
      summary: 'Get current patient reports',
      description: 'Get current patient reports (If patient is logged in)',
    },
    okResponse: {
      description: 'All patient reports',
      type: [BasicReportDto],
    },
  })
  @Get('/reports')
  async getPatientReports(
    @Req() request: Request,
    @Query(new ValidationPipe({ transform: true }))
    query: GetPatientReportsQuery,
  ): Promise<BasicReportDto[]> {
    const user = request.user;

    if (user.role !== 'patient') {
      throw new UnauthorizedException();
    }

    return this.reportsService.findAllByPatientId(user.id, query);
  }

  @ApiDocumentation({
    operation: {
      summary: 'Get current patient reports',
      description: 'Get current patient reports (If patient is logged in)',
    },
    params: {
      name: 'patientId',
      type: String,
      description: 'Patient ID',
      example: crypto.randomUUID(),
    },
    notFoundResponse: {
      description: 'Patient not found',
    },
    okResponse: {
      description: 'All patient reports',
      type: [BasicReportDto],
    },
  })
  @Get(':patientId/reports')
  async getPatientReportsById(
    @Param('patientId') patientId: string,
    @Req() request: Request,
    @Query(new ValidationPipe({ transform: true }))
    query: GetPatientReportsQuery,
  ): Promise<BasicReportDto[]> {
    const user = request.user;

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.reportsService.findAllByPatientId(patientId, query);
  }

  @ApiDocumentation({
    operation: {
      summary: 'Get current patient scans',
      description: 'Get current patient scans (If patient is logged in)',
    },
    okResponse: {
      description: 'All patient scans',
      type: [ScanDto],
    },
  })
  @Get('/scans')
  async getPatientScans(
    @Req() request: Request,
    @Query(new ValidationPipe({ transform: true }))
    query: GetPatientScansQuery,
  ): Promise<ScanDto[]> {
    const user = request.user;

    if (user.role !== 'patient') {
      throw new UnauthorizedException();
    }

    return this.scansService.findAllByPatientId(user.id, query);
  }

  @ApiDocumentation({
    operation: {
      summary: 'Get current patient scans',
      description: 'Get current patient scans (If patient is logged in)',
    },
    params: {
      name: 'patientId',
      type: String,
      description: 'Patient ID',
      example: crypto.randomUUID(),
    },
    notFoundResponse: {
      description: 'Patient not found',
    },
    okResponse: {
      description: 'All patient scans',
      type: [ScanDto],
    },
  })
  @Get(':patientId/scans')
  async getPatientScansById(
    @Param('patientId') patientId: string,
    @Req() request: Request,
    @Query(new ValidationPipe({ transform: true }))
    query: GetPatientReportsQuery,
  ): Promise<ScanDto[]> {
    const user = request.user;

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.scansService.findAllByPatientId(patientId, query);
  }

  @ApiDocumentation({
    operation: {
      summary: 'Get current patient treatments',
      description: 'Get current patient treatments (If patient is logged in)',
    },
    okResponse: {
      description: 'All patient treatments',
      type: [TreatmentDto],
    },
  })
  @Get('treatments')
  async getPatientTreatments(
    @Req() request: Request,
    @Query(new ValidationPipe({ transform: true }))
    query: GetPatientTreatmentsQuery,
  ): Promise<TreatmentDto[]> {
    const user = request.user;

    if (user.role !== 'patient') {
      throw new UnauthorizedException();
    }

    return this.treatmentService.findAllByPatientId(user.id, query);
  }

  @ApiDocumentation({
    operation: {
      summary: 'Get current patient treatments',
      description: 'Get current patient treatments (If patient is logged in)',
    },
    params: {
      name: 'patientId',
      type: String,
      description: 'Patient ID',
      example: crypto.randomUUID(),
    },
    notFoundResponse: {
      description: 'Patient not found',
    },
    okResponse: {
      description: 'All patient treatments',
      type: [TreatmentDto],
    },
  })
  @Get(':patientId/treatments')
  async getPatientTreatmentsById(
    @Param('patientId') patientId: string,
    @Req() request: Request,
    @Query(new ValidationPipe({ transform: true }))
    query: GetPatientTreatmentsQuery,
  ): Promise<TreatmentDto[]> {
    const user = request.user;

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.treatmentService.findAllByPatientId(patientId, query);
  }

  @ApiDocumentation({
    operation: {
      summary: 'Get current patient prescriptions',
      description:
        'Get current patient prescriptions (If patient is logged in)',
    },
    okResponse: {
      description: 'All patient prescriptions',
    },
  })
  @Get('prescriptions')
  async getPatientPrescriptions(
    @Req() request: Request,
    @Query(new ValidationPipe({ transform: true }))
    query: GetPatientPrescriptionsQuery,
  ) {
    const user = request.user;

    if (user.role !== 'patient') {
      throw new UnauthorizedException();
    }

    return this.prescriptionsService.findAllByPatientId(user.id, query);
  }

  @ApiDocumentation({
    operation: {
      summary: 'Get current patient prescriptions',
      description:
        'Get current patient prescriptions (If patient is logged in)',
    },
    params: {
      name: 'patientId',
      type: String,
      description: 'Patient ID',
      example: crypto.randomUUID(),
    },
    notFoundResponse: {
      description: 'Patient not found',
    },
    okResponse: {
      description: 'All patient prescriptions',
    },
  })
  @Get(':patientId/prescriptions')
  async getPatientPrescriptionsById(
    @Param('patientId') patientId: string,
    @Req() request: Request,
    @Query(new ValidationPipe({ transform: true }))
    query: GetPatientPrescriptionsQuery,
  ) {
    const user = request.user;

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.prescriptionsService.findAllByPatientId(patientId, query);
  }

  @ApiDocumentation({
    operation: {
      summary: 'Get current patient test results',
      description: 'Get current patient test results (If patient is logged in)',
    },
    okResponse: {
      description: 'All patient test results',
      type: [LaboratoryTestResultDto],
    },
  })
  @Get('test-results')
  async getPatientTestResults(
    @Req() request: Request,
    @Query(new ValidationPipe({ transform: true }))
    query: GetPatientTestResultsQuery,
  ): Promise<LaboratoryTestResultDto[]> {
    const user = request.user;

    if (user.role !== 'patient') {
      throw new UnauthorizedException();
    }

    return this.testResultsService.findAllByPatientId(user.id, query);
  }

  @ApiDocumentation({
    operation: {
      summary: 'Get current patient test results',
      description: 'Get current patient test results (If patient is logged in)',
    },
    params: {
      name: 'patientId',
      type: String,
      description: 'Patient ID',
      example: crypto.randomUUID(),
    },
    notFoundResponse: {
      description: 'Patient not found',
    },
    okResponse: {
      description: 'All patient test results',
      type: [LaboratoryTestResultDto],
    },
  })
  @Get(':patientId/test-results')
  async getPatientTestResultsById(
    @Param('patientId') patientId: string,
    @Req() request: Request,
    @Query(new ValidationPipe({ transform: true }))
    query: GetPatientTestResultsQuery,
  ): Promise<LaboratoryTestResultDto[]> {
    const user = request.user;

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.testResultsService.findAllByPatientId(patientId, query);
  }
}
