import { Request } from 'express';
import {
  Controller,
  Get,
  Param,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';

import { UsersService } from '../users.service';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { ReportsService } from 'src/appointments/reports/reports.service';
import { ScansService } from 'src/appointments/scans/scans.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

import { GetAllUsersQuery } from '../dto/users.dto';
import { GetAllAppointmentsQuery } from 'src/appointments/dto/appointments.dto';
import { GetPatientReportsQuery } from 'src/appointments/reports/dto/reports.dto';
import { GetPatientScansQuery } from 'src/appointments/scans/dto/scans.dto';
import type { Payload } from 'src/types/payload.type';

@Controller('/users/patients')
export class PatientsController {
  constructor(
    private readonly usersService: UsersService,
    private readonly appointmentsService: AppointmentsService,
    private readonly reportsService: ReportsService,
    private readonly scansService: ScansService,
  ) {}

  @UseGuards(JwtGuard)
  @Get()
  async getAllPatients(
    @Req() request: Request,
    @Query(new ValidationPipe({ transform: true }))
    query: GetAllUsersQuery,
  ) {
    const user: Payload = request['user'];

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.usersService.findAll('patient', {
      ...query,
    });
  }

  @UseGuards(JwtGuard)
  @Get('/appointments')
  async getPatientsAppointments(
    @Query(new ValidationPipe({ transform: true }))
    query: GetAllAppointmentsQuery,
    @Req() request: Request,
  ) {
    const user: Payload = request['user'];

    if (user.role !== 'patient') {
      throw new UnauthorizedException();
    }

    return this.appointmentsService.findAll(query, user.id);
  }

  @UseGuards(JwtGuard)
  @Get('/reports')
  async getPatientReports(
    @Req() request: Request,
    @Query(new ValidationPipe({ transform: true }))
    query: GetPatientReportsQuery,
  ) {
    const user: Payload = request['user'];

    if (user.role !== 'patient') {
      throw new UnauthorizedException();
    }

    return this.reportsService.findAllByPatientId(user.id, query);
  }

  @UseGuards(JwtGuard)
  @Get(':id/reports')
  async getPatientReportsById(
    @Param('id') id: string,
    @Req() request: Request,
    @Query(new ValidationPipe({ transform: true }))
    query: GetPatientReportsQuery,
  ) {
    const user: Payload = request['user'];

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.reportsService.findAllByPatientId(id, query);
  }

  @UseGuards(JwtGuard)
  @Get('/scans')
  async getPatientScans(
    @Req() request: Request,
    @Query(new ValidationPipe({ transform: true }))
    query: GetPatientScansQuery,
  ) {
    const user: Payload = request['user'];

    if (user.role !== 'patient') {
      throw new UnauthorizedException();
    }

    return this.scansService.findAllByPatientId(user.id, query);
  }

  @UseGuards(JwtGuard)
  @Get(':id/scans')
  async getPatientScansById(
    @Param('id') id: string,
    @Req() request: Request,
    @Query(new ValidationPipe({ transform: true }))
    query: GetPatientReportsQuery,
  ) {
    const user: Payload = request['user'];

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.scansService.findAllByPatientId(id, query);
  }
}
