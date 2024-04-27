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
import { JwtGuard } from 'src/auth/guards/jwt.guard';

import {
  CreateAppointmentDto,
  GetAllAppointmentsQuery,
} from './dto/appointments.dto';
import type { Payload } from 'src/types/payload.type';
import { ReportsService } from './reports/reports.service';

@Controller('appointments')
export class AppointmentsController {
  constructor(
    private readonly appointmentsService: AppointmentsService,
    private readonly reportsService: ReportsService,
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

    return this.appointmentsService.findAll(query);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async getAppointmentById(@Param('id') id: string, @Req() request: Request) {
    const user: Payload = request['user'];

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.appointmentsService.findById(id);
  }

  @UseGuards(JwtGuard)
  @Get(':id/reports')
  async getAppointmentReportsById(
    @Param('id') id: string,
    @Req() request: Request,
  ) {
    const user: Payload = request['user'];

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.reportsService.findAllByAppointmentId(id);
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
  async approveAppointment(@Param('id') id: string, @Req() request: Request) {
    const user: Payload = request['user'];

    if (user.role !== 'admin') {
      throw new UnauthorizedException();
    }

    return this.appointmentsService.changeStatus(id, 'approved');
  }

  @UseGuards(JwtGuard)
  @Patch(':id/reject')
  async rejectAppointment(@Param('id') id: string, @Req() request: Request) {
    const user: Payload = request['user'];

    if (user.role !== 'admin') {
      throw new UnauthorizedException();
    }

    return this.appointmentsService.changeStatus(id, 'rejected');
  }

  @UseGuards(JwtGuard)
  @Patch(':id/complete')
  async completeAppointment(@Param('id') id: string, @Req() request: Request) {
    const user: Payload = request['user'];

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.appointmentsService.changeStatus(id, 'completed');
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

    return this.appointmentsService.changeStatus(id, 'cancelled');
  }
}
