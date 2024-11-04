import type { Request } from 'express';
import {
  Controller,
  Post,
  Patch,
  Get,
  Delete,
  Param,
  Body,
  Req,
  UnauthorizedException,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';

import { DiagnosesService } from './diagnoses.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

import {
  CreateDiagnosisDto,
  DiagnosisDto,
  UpdateDiagnosisDto,
} from './dto/diagnoses.dto';
import { ApiDocumentation } from 'src/decorators/documentation.decorator';

@ApiDocumentation({
  tags: 'Diagnoses',
  security: 'bearer',
  unauthorizedResponse: { description: 'Unauthorized' },
  badRequestResponse: { description: 'Bad Request' },
})
@UseGuards(JwtGuard)
@Controller('settings/diagnoses')
export class DiagnosesController {
  constructor(private readonly diagnosesService: DiagnosesService) {}

  @ApiDocumentation({
    operation: {
      summary: 'Get all diagnoses',
      description: 'Get all diagnoses data',
    },
    okResponse: {
      description: 'Diagnoses data',
      type: [DiagnosisDto],
    },
  })
  @Get()
  async getAllDiagnoses(@Req() request: Request) {
    const user = request.user;

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.diagnosesService.findAll();
  }

  @ApiDocumentation({
    operation: {
      summary: 'Get diagnosis by ID',
      description: 'Get diagnosis data by ID',
    },
    params: {
      name: 'diagnosisId',
      type: String,
      description: 'Diagnosis ID',
      example: crypto.randomUUID(),
    },
    notFoundResponse: {
      description: 'Diagnosis not found',
    },
    okResponse: {
      description: 'Diagnosis data',
      type: DiagnosisDto,
    },
  })
  @Get(':diagnosisId')
  async getDiagnosisById(
    @Param('diagnosisId') diagnosisId: string,
    @Req() request: Request,
  ) {
    const user = request.user;

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.diagnosesService.findById(diagnosisId);
  }

  @ApiDocumentation({
    operation: {
      summary: 'Create diagnosis',
      description: 'Create new diagnosis',
    },
    okResponse: {
      description: 'Diagnosis created',
      type: DiagnosisDto,
    },
  })
  @Post()
  async createDiagnosis(
    @Body(ValidationPipe) createDiagnosisDto: CreateDiagnosisDto,
    @Req() request: Request,
  ) {
    const user = request.user;

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.diagnosesService.create(user.id, createDiagnosisDto);
  }

  @ApiDocumentation({
    operation: {
      summary: 'Update diagnosis',
      description: 'Update diagnosis data',
    },
    params: {
      name: 'diagnosisId',
      type: String,
      description: 'Diagnosis ID',
      example: crypto.randomUUID(),
    },
    notFoundResponse: {
      description: 'Diagnosis not found',
    },
    okResponse: {
      description: 'Diagnosis updated',
      type: DiagnosisDto,
    },
  })
  @Patch(':diagnosisId')
  async updateDiagnosis(
    @Param('diagnosisId') diagnosisId: string,
    @Body(ValidationPipe) updateDiagnosisDto: UpdateDiagnosisDto,
    @Req() request: Request,
  ) {
    const user = request.user;

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.diagnosesService.update(
      user.id,
      diagnosisId,
      updateDiagnosisDto,
    );
  }

  @ApiDocumentation({
    operation: {
      summary: 'Delete diagnosis',
      description: 'Delete diagnosis by ID',
    },
    params: {
      name: 'diagnosisId',
      type: String,
      description: 'Diagnosis ID',
      example: crypto.randomUUID(),
    },
    notFoundResponse: {
      description: 'Diagnosis not found',
    },
    conflictResponse: {
      description: 'Diagnosis is being used in an EMR',
    },
    okResponse: {
      description: 'Diagnosis deleted',
      type: DiagnosisDto,
    },
  })
  @Delete(':diagnosisId')
  async deleteDiagnosis(
    @Param('diagnosisId') diagnosisId: string,
    @Req() request: Request,
  ) {
    const user = request.user;

    if (!user.isSuperAdmin) {
      throw new UnauthorizedException();
    }

    return this.diagnosesService.delete(user.id, diagnosisId);
  }
}
