import type { Request } from 'express';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UnauthorizedException,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';

import { EmrService } from './emr.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

import { EmrDto, UpdateEmrDto } from './dto/emr.dto';
import { ApiDocumentation } from 'src/decorators/documentation.decorator';

@ApiDocumentation({
  tags: 'EMR',
  security: 'bearer',
  unauthorizedResponse: { description: 'Unauthorized' },
  badRequestResponse: { description: 'Bad Request' },
})
@UseGuards(JwtGuard)
@Controller('emr')
export class EmrController {
  constructor(private emrService: EmrService) {}

  @ApiDocumentation({
    operation: {
      summary: 'Get patient EMR by ID',
      description: 'Get certain patient EMR data',
    },
    params: {
      name: 'patientId',
      type: String,
      description: 'Patient ID',
      example: crypto.randomUUID(),
    },
    notFoundResponse: {
      description: 'Patient/EMR not Found',
    },
    okResponse: {
      description: 'Patient EMR data',
      type: EmrDto,
    },
  })
  @Get(':patientId')
  async getById(
    @Param('patientId') patientId: string,
    @Req() request: Request,
  ): Promise<EmrDto> {
    const user = request.user;

    if (user.role === 'patient' && user.id !== patientId) {
      throw new UnauthorizedException();
    }

    return this.emrService.getById(patientId);
  }

  @ApiDocumentation({
    operation: {
      summary: 'Update patient EMR by ID',
      description: 'Update certain patient EMR data',
    },
    params: {
      name: 'patientId',
      type: String,
      description: 'Patient ID',
      example: crypto.randomUUID(),
    },
    notFoundResponse: {
      description: 'Patient not Found',
    },
    okResponse: {
      description: 'Patient EMR data updated',
      type: EmrDto,
    },
  })
  @Patch(':patientId')
  async update(
    @Param('patientId') patientId: string,
    @Body(new ValidationPipe())
    emrDto: UpdateEmrDto,
    @Req() request: Request,
  ): Promise<EmrDto> {
    const user = request.user;

    if (user.role !== 'doctor') {
      throw new UnauthorizedException();
    }

    return this.emrService.update(patientId, emrDto, user.id);
  }
}
