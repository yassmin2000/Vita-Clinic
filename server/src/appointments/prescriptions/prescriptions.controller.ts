import type { Request } from 'express';
import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';

import { PrescriptionsService } from './prescriptions.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

import {
  BasicPrescriptionDto,
  CreatePrescriptionDto,
  UpdatePrescriptionDto,
} from './dto/prescriptions.dto';
import { ApiDocumentation } from 'src/decorators/documentation.decorator';

@ApiDocumentation({
  tags: 'Prescriptions',
  security: 'bearer',
  unauthorizedResponse: {
    description: 'Unauthorized',
  },
  badRequestResponse: {
    description: 'Bad Request',
  },
})
@UseGuards(JwtGuard)
@Controller('prescriptions')
export class PrescriptionsController {
  constructor(private readonly prescriptionsService: PrescriptionsService) {}

  @ApiDocumentation({
    operation: {
      summary: 'Create a prescription',
      description: 'Create a prescription for an appointment',
    },
    body: {
      description: 'Prescription data',
      type: CreatePrescriptionDto,
    },
    consumes: 'application/json',
    notFoundResponse: {
      description: 'Appointment/Medication not found',
    },
    createdResponse: {
      description: 'Prescription created',
      type: BasicPrescriptionDto,
    },
  })
  @Post()
  async createTreatment(
    @Body(ValidationPipe) createPrescriptionDto: CreatePrescriptionDto,
    @Req() request: Request,
  ) {
    const user = request.user;

    if (user.role !== 'doctor') {
      throw new UnauthorizedException();
    }

    return this.prescriptionsService.create(createPrescriptionDto, user.id);
  }

  @ApiDocumentation({
    operation: {
      summary: 'Update a prescription',
      description: 'Update a prescription for an appointment',
    },
    params: {
      name: 'prescriptionId',
      type: String,
      description: 'Prescription ID',
      example: crypto.randomUUID(),
    },
    body: {
      description: 'Prescription data',
      type: UpdatePrescriptionDto,
    },
    consumes: 'application/json',
    notFoundResponse: {
      description: 'Prescription not found',
    },
    okResponse: {
      description: 'Prescription updated',
      type: BasicPrescriptionDto,
    },
  })
  @Patch(':prescriptionId')
  async updateTreatment(
    @Param('prescriptionId') prescriptionId: string,
    @Body(ValidationPipe) updatePrescriptionDto: UpdatePrescriptionDto,
    @Req() request: Request,
  ) {
    const user = request.user;

    if (user.role !== 'doctor') {
      throw new UnauthorizedException();
    }

    return this.prescriptionsService.update(
      prescriptionId,
      updatePrescriptionDto,
      user.id,
    );
  }
}
