import type { Request } from 'express';
import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Patch,
  Param,
  ValidationPipe,
  UnauthorizedException,
} from '@nestjs/common';

import { TreatmentService } from './treatments.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

import {
  BasicTreatmentDto,
  CreateTreatmentDto,
  UpdateTreatmentDto,
} from './dto/treatments.dto';
import { ApiDocumentation } from 'src/decorators/documentation.decorator';

@ApiDocumentation({
  tags: 'Treatments',
  security: 'bearer',
  unauthorizedResponse: {
    description: 'Unauthorized',
  },
  badRequestResponse: {
    description: 'Bad Request',
  },
})
@UseGuards(JwtGuard)
@Controller('treatments')
export class TreatmentController {
  constructor(private readonly treatmentService: TreatmentService) {}

  @ApiDocumentation({
    operation: {
      summary: 'Create a treatment',
      description: 'Create a treatment for an appointment',
    },
    body: {
      description: 'Treatment data',
      type: CreateTreatmentDto,
    },
    consumes: 'application/json',
    notFoundResponse: {
      description: 'Appointment/Therapy not found',
    },
    createdResponse: {
      description: 'Treatment created',
      type: BasicTreatmentDto,
    },
  })
  @Post()
  async createTreatment(
    @Body(ValidationPipe) createTreatmentDto: CreateTreatmentDto,
    @Req() request: Request,
  ): Promise<BasicTreatmentDto> {
    const user = request.user;

    if (user.role !== 'doctor') {
      throw new UnauthorizedException();
    }

    return this.treatmentService.create(createTreatmentDto, user.id);
  }

  @ApiDocumentation({
    operation: {
      summary: 'Update a treatment',
      description: 'Update a treatment for an appointment',
    },
    params: {
      name: 'treatmentId',
      type: String,
      description: 'Treatment ID',
      example: crypto.randomUUID(),
    },
    body: {
      description: 'Treatment data',
      type: UpdateTreatmentDto,
    },
    consumes: 'application/json',
    notFoundResponse: {
      description: 'Treatment not found',
    },
    okResponse: {
      description: 'Treatment updated',
      type: BasicTreatmentDto,
    },
  })
  @Patch(':treatmentId')
  async updateTreatment(
    @Param('treatmentId') treatmentId: string,
    @Body(ValidationPipe) updateTreatmentDto: UpdateTreatmentDto,
    @Req() request: Request,
  ): Promise<BasicTreatmentDto> {
    const user = request.user;

    if (user.role !== 'doctor') {
      throw new UnauthorizedException();
    }

    return this.treatmentService.update(
      treatmentId,
      updateTreatmentDto,
      user.id,
    );
  }
}
