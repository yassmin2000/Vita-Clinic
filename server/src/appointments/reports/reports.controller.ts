import type { Request } from 'express';
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
  ValidationPipe,
} from '@nestjs/common';

import { ReportsService } from './reports.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

import {
  BasicReportDto,
  CreateMessageDto,
  CreateReportDto,
  MessageDto,
  ReportDto,
  UpdateReportDto,
} from './dto/reports.dto';
import { ApiDocumentation } from 'src/decorators/documentation.decorator';

@ApiDocumentation({
  tags: 'Reports',
  security: 'bearer',
  unauthorizedResponse: {
    description: 'Unauthorized',
  },
  badRequestResponse: {
    description: 'Bad Request',
  },
})
@UseGuards(JwtGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @ApiDocumentation({
    operation: {
      summary: 'Get report by ID',
      description: 'Get certain report data by ID',
    },
    params: {
      name: 'reportId',
      type: String,
      description: 'Report ID',
      example: crypto.randomUUID(),
    },
    notFoundResponse: {
      description: 'Report not found',
    },
    okResponse: {
      description: 'Report data',
      type: [ReportDto],
    },
  })
  @Get(':reportId')
  async getReportById(
    @Param('reportId') reportId: string,
    @Req() request: Request,
  ): Promise<ReportDto> {
    const user = request.user;

    const report = await this.reportsService.findById(reportId);

    if (user.role === 'patient' && report.appointment.patientId !== user.id) {
      throw new UnauthorizedException();
    }

    return report;
  }

  @ApiDocumentation({
    operation: {
      summary: 'Create a report',
      description: 'Create a report for an appointment',
    },
    body: {
      description: 'Report data',
      type: CreateReportDto,
    },
    consumes: 'application/json',
    notFoundResponse: {
      description: 'Appointment not found',
    },
    createdResponse: {
      description: 'Report created',
      type: BasicReportDto,
    },
  })
  @Post()
  async createReport(
    @Body(ValidationPipe) dto: CreateReportDto,
    @Req() request: Request,
  ): Promise<BasicReportDto> {
    const user = request.user;

    if (user.role !== 'doctor') {
      throw new UnauthorizedException();
    }
    return this.reportsService.create(dto, user.id);
  }

  @ApiDocumentation({
    operation: {
      summary: 'Update a report',
      description: 'Update a report for an appointment',
    },
    params: {
      name: 'reportId',
      type: String,
      description: 'Report ID',
      example: crypto.randomUUID(),
    },
    body: {
      description: 'Report data',
      type: UpdateReportDto,
    },
    consumes: 'application/json',
    notFoundResponse: {
      description: 'Report not found',
    },
    okResponse: {
      description: 'Report updated',
      type: BasicReportDto,
    },
  })
  @Patch(':reportId')
  async updateReport(
    @Param('reportId') reportId: string,
    @Body(ValidationPipe) updateReportDto: UpdateReportDto,
    @Req() request: Request,
  ): Promise<BasicReportDto> {
    const user = request.user;

    if (user.role !== 'doctor') {
      throw new UnauthorizedException();
    }

    return this.reportsService.update(reportId, updateReportDto, user.id);
  }

  @ApiDocumentation({
    operation: {
      summary: 'Process a report',
      description: 'Set a report status to processed',
    },
    params: {
      name: 'reportId',
      type: String,
      description: 'Report ID',
      example: crypto.randomUUID(),
    },
    notFoundResponse: {
      description: 'Report not found',
    },
    okResponse: {
      description: 'Report processed',
      type: BasicReportDto,
    },
  })
  @Patch(':reportId/process')
  async processReport(
    @Param('reportId') reportId: string,
    @Req() request: Request,
  ): Promise<BasicReportDto> {
    const user = request.user;

    if (user.role !== 'doctor') {
      throw new UnauthorizedException();
    }

    return this.reportsService.updateStatus(reportId, 'processed');
  }

  @ApiDocumentation({
    operation: {
      summary: 'Fail a report',
      description: 'Set a report status to failed',
    },
    params: {
      name: 'reportId',
      type: String,
      description: 'Report ID',
      example: crypto.randomUUID(),
    },
    notFoundResponse: {
      description: 'Report not found',
    },
    okResponse: {
      description: 'Report failed',
      type: BasicReportDto,
    },
  })
  @Patch(':reportId/fail')
  async failProcessReport(
    @Param('reportId') reportId: string,
    @Req() request: Request,
  ): Promise<BasicReportDto> {
    const user = request.user;

    if (user.role !== 'doctor') {
      throw new UnauthorizedException();
    }

    return this.reportsService.updateStatus(reportId, 'failed');
  }

  @ApiDocumentation({
    operation: {
      summary: 'Get messages',
      description: 'Get messages for a report',
    },
    params: {
      name: 'reportId',
      type: String,
      description: 'Report ID',
      example: crypto.randomUUID(),
    },
    notFoundResponse: {
      description: 'Report not found',
    },
    okResponse: {
      description: 'Messages',
      type: [MessageDto],
    },
  })
  @Get(':reportId/messages')
  async getMessages(
    @Param('reportId') reportId: string,
    @Req() request: Request,
  ): Promise<MessageDto[]> {
    const user = request.user;

    if (user.role !== 'doctor') {
      throw new UnauthorizedException();
    }

    return this.reportsService.getMessages(reportId, user.id);
  }

  @ApiDocumentation({
    operation: {
      summary: 'Create a message',
      description: 'Create a message for a report',
    },
    params: {
      name: 'reportId',
      type: String,
      description: 'Report ID',
      example: crypto.randomUUID(),
    },
    body: {
      description: 'Message data',
      type: CreateMessageDto,
    },
    consumes: 'application/json',
    notFoundResponse: {
      description: 'Report not found',
    },
    createdResponse: {
      description: 'Message created',
      type: MessageDto,
    },
  })
  @Post(':reportId/messages')
  async createMessage(
    @Param('reportId') reportId: string,
    @Body(ValidationPipe) dto: CreateMessageDto,
    @Req() request: Request,
  ) {
    const user = request.user;

    if (user.role !== 'doctor') {
      throw new UnauthorizedException();
    }

    return this.reportsService.createMessage(reportId, user.id, dto);
  }
}
