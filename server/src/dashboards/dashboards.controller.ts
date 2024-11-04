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
  AdminDashboardGeneralStatisticsDto,
  DashboardAppointmentsDataDto,
  DashboardDoctorsAppointmentsDataDto,
  DashboardDoctorsSexDataDto,
  DashboardInvoicseDataDto,
  DashboardMedicalInsightsDto,
  DashboardMedicalServicesInsightsDto,
  DashboardPatientsAgeSexDataDto,
  DoctorDashboardGeneralStatisticsDto,
  GetAppointmentsDataQuery,
  GetInvoicesDataQuery,
} from './dto/dashboards.dto';
import { ApiDocumentation } from 'src/decorators/documentation.decorator';

@ApiDocumentation({
  tags: 'Dashboards',
  security: 'bearer',
  unauthorizedResponse: { description: 'Unauthorized' },
  badRequestResponse: { description: 'Bad Request' },
})
@UseGuards(JwtGuard)
@Controller('dashboards')
export class DashboardsController {
  constructor(private readonly dashboardsService: DashboardsService) {}

  @ApiDocumentation({
    operation: {
      summary: 'Get admin general statistics',
      description: 'Get admin general statistics data',
    },
    okResponse: {
      description: 'Admin general statistics data',
      type: AdminDashboardGeneralStatisticsDto,
    },
  })
  @Get('general/admin')
  async getAdminGeneralStatistics(
    @Req() request: Request,
  ): Promise<
    AdminDashboardGeneralStatisticsDto | DoctorDashboardGeneralStatisticsDto
  > {
    const user = request.user;

    if (user.role !== 'admin') {
      throw new UnauthorizedException();
    }

    return this.dashboardsService.getAdminGeneralStatistics();
  }

  @ApiDocumentation({
    operation: {
      summary: 'Get doctor general statistics',
      description: 'Get doctor general statistics data',
    },
    okResponse: {
      description: 'Doctor general statistics data',
      type: DoctorDashboardGeneralStatisticsDto,
    },
  })
  @Get('general/doctor')
  async getDoctorGeneralStatistics(
    @Req() request: Request,
  ): Promise<
    AdminDashboardGeneralStatisticsDto | DoctorDashboardGeneralStatisticsDto
  > {
    const user = request.user;

    if (user.role !== 'doctor') {
      throw new UnauthorizedException();
    }

    return this.dashboardsService.getDoctorGeneralStatistics(user.id);
  }

  @ApiDocumentation({
    operation: {
      summary: 'Get invoices chart data',
      description: 'Get invoices chart data',
    },
    okResponse: {
      description: 'Invoices chart data',
      type: [DashboardInvoicseDataDto],
    },
  })
  @Get('invoices')
  async getInvoicesChartData(
    @Req() request: Request,
    @Query(new ValidationPipe())
    query: GetInvoicesDataQuery,
  ): Promise<DashboardInvoicseDataDto[]> {
    const user = request.user;

    if (user.role !== 'admin') {
      throw new UnauthorizedException();
    }

    return this.dashboardsService.getInvoicesData(query);
  }

  @ApiDocumentation({
    operation: {
      summary: 'Get appointments calendar data',
      description: 'Get appointments calendar data',
    },
    okResponse: {
      description: 'Appointments calendar data',
      type: [DashboardAppointmentsDataDto],
    },
  })
  @Get('appointments')
  async getAppointmentsCalendarData(
    @Req() request: Request,
    @Query(new ValidationPipe({ transform: true }))
    query: GetAppointmentsDataQuery,
  ): Promise<DashboardAppointmentsDataDto[]> {
    const user = request.user;

    if (user.role !== 'admin') {
      throw new UnauthorizedException();
    }

    return this.dashboardsService.getAppointmentsData(query);
  }

  @ApiDocumentation({
    operation: {
      summary: 'Get patients age group and sex distribution',
      description: 'Get patients age group and sex distribution data',
    },
    okResponse: {
      description: 'Patients age group and sex distribution data',
      type: [DashboardPatientsAgeSexDataDto],
    },
  })
  @Get('patients')
  async getPatientsAgeSexDistribution(
    @Req() request: Request,
  ): Promise<DashboardPatientsAgeSexDataDto[]> {
    const user = request.user;

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.dashboardsService.getPatientsAgeSexData();
  }

  @ApiDocumentation({
    operation: {
      summary: 'Get doctors sex distribution',
      description: 'Get doctors sex distribution data',
    },
    okResponse: {
      description: 'Doctors sex distribution data',
      type: [DashboardDoctorsSexDataDto],
    },
  })
  @Get('doctors')
  async getDoctorsSexDistribution(
    @Req() request: Request,
  ): Promise<DashboardDoctorsSexDataDto[]> {
    const user = request.user;

    if (user.role !== 'admin') {
      throw new UnauthorizedException();
    }

    return this.dashboardsService.getDoctorsSexData();
  }

  @ApiDocumentation({
    operation: {
      summary: 'Get doctors completed appointments distribution',
      description: 'Get doctors completed appointments distribution data',
    },
    okResponse: {
      description: 'Doctors completed appointments distribution data',
      type: [DashboardDoctorsAppointmentsDataDto],
    },
  })
  @Get('doctors/appointments')
  async getDoctorsCompletedAppointmentDistribution(
    @Req() request: Request,
    @Query(new ValidationPipe())
    query: GetInvoicesDataQuery,
  ): Promise<DashboardDoctorsAppointmentsDataDto[]> {
    const user = request.user;

    if (user.role !== 'admin') {
      throw new UnauthorizedException();
    }

    return this.dashboardsService.getDoctorsAppointmentsData(query);
  }

  @ApiDocumentation({
    operation: {
      summary: 'Get medical insights data',
      description: 'Get medical insights data',
    },
    okResponse: {
      description: 'Medical insights data',
      type: DashboardMedicalInsightsDto,
    },
  })
  @Get('insights/medical')
  async getMedicalInsightsData(
    @Req() request: Request,
  ): Promise<DashboardMedicalInsightsDto> {
    const user = request.user;

    if (user.role !== 'doctor') {
      throw new UnauthorizedException();
    }

    return this.dashboardsService.getMedicalInsights();
  }

  @ApiDocumentation({
    operation: {
      summary: 'Get services insights data',
      description: 'Get services insights data',
    },
    okResponse: {
      description: 'Services insights data',
      type: DashboardMedicalServicesInsightsDto,
    },
  })
  @Get('insights/services')
  async getServicesInsightsData(
    @Req() request: Request,
  ): Promise<DashboardMedicalServicesInsightsDto> {
    const user = request.user;

    if (user.role !== 'admin') {
      throw new UnauthorizedException();
    }

    return this.dashboardsService.getMedicalServicesInsights();
  }
}
