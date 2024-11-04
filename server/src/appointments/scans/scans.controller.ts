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

import { ScansService } from './scans.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

import {
  BasicScanDto,
  CreateScanDto,
  FullScanDto,
  UpdateScanDto,
} from './dto/scans.dto';
import { ApiDocumentation } from 'src/decorators/documentation.decorator';

@ApiDocumentation({
  tags: 'Scans',
  security: 'bearer',
  unauthorizedResponse: {
    description: 'Unauthorized',
  },
  badRequestResponse: {
    description: 'Bad Request',
  },
})
@UseGuards(JwtGuard)
@Controller('scans')
export class ScansController {
  constructor(private readonly scansService: ScansService) {}

  @ApiDocumentation({
    operation: {
      summary: 'Create a scan',
      description: 'Create a scan for an appointment',
    },
    params: {
      name: 'scanId',
      type: String,
      description: 'Scan ID',
      example: crypto.randomUUID(),
    },
    okResponse: {
      description: 'Scan created',
      type: FullScanDto,
    },
  })
  @Get(':scanId')
  async getScanById(
    @Param('scanId') scanId: string,
    @Req() request: Request,
  ): Promise<FullScanDto> {
    const user = request.user;

    const scan = await this.scansService.findById(scanId);

    if (user.role === 'patient' && scan.appointment.patientId !== user.id) {
      throw new UnauthorizedException();
    }

    return scan;
  }

  @ApiDocumentation({
    operation: {
      summary: 'Create a scan',
      description: 'Create a scan for an appointment',
    },
    body: {
      description: 'Scan data',
      type: CreateScanDto,
    },
    consumes: 'application/json',
    notFoundResponse: {
      description: 'Appointment/Modality not found',
    },
    createdResponse: {
      description: 'Scan created',
      type: BasicScanDto,
    },
  })
  @Post()
  async createScan(
    @Body(ValidationPipe) dto: CreateScanDto,
    @Req() request: Request,
  ): Promise<BasicScanDto> {
    const user = request.user;

    if (user.role !== 'doctor') {
      throw new UnauthorizedException();
    }
    return this.scansService.create(dto, user.id);
  }

  @ApiDocumentation({
    operation: {
      summary: 'Update a scan',
      description: 'Update a scan for an appointment',
    },
    params: {
      name: 'id',
      type: String,
      description: 'Scan ID',
      example: crypto.randomUUID(),
    },
    body: {
      description: 'Scan data',
      type: UpdateScanDto,
    },
    consumes: 'application/json',
    notFoundResponse: {
      description: 'Scan not found',
    },
    okResponse: {
      description: 'Scan updated',
      type: BasicScanDto,
    },
  })
  @Patch(':id')
  async updateScan(
    @Param('id') id: string,
    @Body(ValidationPipe) updateScanDto: UpdateScanDto,
    @Req() request: Request,
  ): Promise<BasicScanDto> {
    const user = request.user;

    if (user.role !== 'doctor') {
      throw new UnauthorizedException();
    }

    return this.scansService.update(id, updateScanDto, user.id);
  }
}
