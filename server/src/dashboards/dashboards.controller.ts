import type { Request } from 'express';

import {
  Controller,
  Get,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';

import { DashboardsService } from './dashboards.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

import {
  GetAppointmentsDataQuery,
  GetInvoicesDataQuery,
} from './dto/dashboards.dto';
import type { Payload } from 'src/types/payload.type';

@Controller('dashboards')
export class DashboardsController {
  constructor(private readonly dashboardsService: DashboardsService) {}

  @UseGuards(JwtGuard)
  @Get('general')
  async getGeneralStatistics(@Req() request: Request) {
    const user: Payload = request['user'];

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.dashboardsService.getStatistics(user.id, user.role);
  }

  @UseGuards(JwtGuard)
  @Get('invoices')
  async getInvoicesChartData(
    @Req() request: Request,
    @Query(new ValidationPipe())
    query: GetInvoicesDataQuery,
  ) {
    const user: Payload = request['user'];

    if (user.role !== 'admin') {
      throw new UnauthorizedException();
    }

    return this.dashboardsService.getInvoicesData(query);
  }

  @UseGuards(JwtGuard)
  @Get('appointments')
  async getAppointmentsCalendarData(
    @Req() request: Request,
    @Query(new ValidationPipe({ transform: true }))
    query: GetAppointmentsDataQuery,
  ) {
    const user: Payload = request['user'];

    if (user.role !== 'admin') {
      throw new UnauthorizedException();
    }

    return this.dashboardsService.getAppointmentsData(query);
  }

  @UseGuards(JwtGuard)
  @Get('patients')
  async getPatientsAgeSexDistribution(@Req() request: Request) {
    const user: Payload = request['user'];

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.dashboardsService.getPatientsAgeSexData();
  }

  @UseGuards(JwtGuard)
  @Get('doctors')
  async getDoctorsSexDistribution(@Req() request: Request) {
    const user: Payload = request['user'];

    if (user.role !== 'admin') {
      throw new UnauthorizedException();
    }

    return this.dashboardsService.getDoctorsSexData();
  }

  @UseGuards(JwtGuard)
  @Get('doctors/appointments')
  async getDoctorsCompletedAppointmentDistribution(
    @Req() request: Request,
    @Query(new ValidationPipe())
    query: GetInvoicesDataQuery,
  ) {
    const user: Payload = request['user'];

    if (user.role !== 'admin') {
      throw new UnauthorizedException();
    }

    return this.dashboardsService.getDoctorsAppointmentsData(query);
  }
}
