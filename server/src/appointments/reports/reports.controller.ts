import { Request } from 'express';
import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  UnauthorizedException,
  UseGuards,
  Patch,
  Param,
  Delete,
  ValidationPipe,
} from '@nestjs/common';

import { ReportsService } from './reports.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

import {
  CreateMessageDto,
  CreateReportDto,
  UpdateReportDto,
} from './dto/reports.dto';
import type { Payload } from 'src/types/payload.type';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @UseGuards(JwtGuard)
  @Get(':id')
  async getReportById(@Param('id') id: string, @Req() request: Request) {
    const user: Payload = request['user'];

    const report = await this.reportsService.findById(id);

    if (user.role === 'patient' && report.appointment.patientId !== user.id) {
      throw new UnauthorizedException();
    }

    return report;
  }

  @UseGuards(JwtGuard)
  @Post()
  async createReport(
    @Body(ValidationPipe) dto: CreateReportDto,
    @Req() request: Request,
  ) {
    const user: Payload = request['user'];

    if (user.role !== 'doctor') {
      throw new UnauthorizedException();
    }
    return this.reportsService.create(dto);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async updateReport(
    @Param('id') id: string,
    @Body(ValidationPipe) updateReportDto: UpdateReportDto,
    @Req() request: Request,
  ) {
    const user: Payload = request['user'];

    if (user.role !== 'doctor') {
      throw new UnauthorizedException();
    }

    return this.reportsService.update(id, updateReportDto);
  }

  @UseGuards(JwtGuard)
  @Patch(':id/process')
  async processReport(@Param('id') id: string, @Req() request: Request) {
    const user: Payload = request['user'];

    if (user.role !== 'doctor') {
      throw new UnauthorizedException();
    }

    return this.reportsService.updateStatus(id, 'processed');
  }

  @UseGuards(JwtGuard)
  @Patch(':id/fail')
  async failProcessReport(@Param('id') id: string, @Req() request: Request) {
    const user: Payload = request['user'];

    if (user.role !== 'doctor') {
      throw new UnauthorizedException();
    }

    return this.reportsService.updateStatus(id, 'failed');
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async deleteReport(@Param('id') id: string, @Req() request: Request) {
    const user: Payload = request['user'];

    if (!user.isSuperAdmin) {
      throw new UnauthorizedException();
    }

    return this.reportsService.delete(id);
  }

  @UseGuards(JwtGuard)
  @Get(':id/messages')
  async getMessages(@Param('id') id: string, @Req() request: Request) {
    const user: Payload = request['user'];

    if (user.role !== 'doctor') {
      throw new UnauthorizedException();
    }

    return this.reportsService.getMessages(id, user.id);
  }

  @UseGuards(JwtGuard)
  @Post(':id/messages')
  async createMessage(
    @Param('id') id: string,
    @Body(ValidationPipe) dto: CreateMessageDto,
    @Req() request: Request,
  ) {
    const user: Payload = request['user'];

    if (user.role !== 'doctor') {
      throw new UnauthorizedException();
    }

    return this.reportsService.createMessage(id, user.id, dto);
  }
}
