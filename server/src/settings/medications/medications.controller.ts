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
  Delete,
  ValidationPipe,
} from '@nestjs/common';

import { MedicationsService } from './medications.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

import {
  UpdateMedicationDto,
  CreateMedicationDto,
  MedicationDto,
} from './dto/medications.dto';
import { ApiDocumentation } from 'src/decorators/documentation.decorator';

@ApiDocumentation({
  tags: 'Medications',
  security: 'bearer',
  unauthorizedResponse: {
    description: 'Unauthorized',
  },
  badRequestResponse: {
    description: 'Bad request',
  },
})
@UseGuards(JwtGuard)
@Controller('settings/medications')
export class MedicationsController {
  constructor(private readonly medicationsService: MedicationsService) {}

  @ApiDocumentation({
    operation: {
      summary: 'Get all medications',
      description: 'Get all medications data',
    },
    okResponse: {
      description: 'Medications data',
      type: [MedicationDto],
    },
  })
  @Get()
  async getAllMedications(@Req() request: Request): Promise<MedicationDto[]> {
    const user = request.user;

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.medicationsService.findAll();
  }

  @ApiDocumentation({
    operation: {
      summary: 'Get medication by ID',
      description: 'Get medication data by ID',
    },
    params: {
      name: 'medicationId',
      type: String,
      description: 'Medication ID',
      example: crypto.randomUUID(),
    },
    notFoundResponse: {
      description: 'Medication not found',
    },
    okResponse: {
      description: 'Medication data',
      type: MedicationDto,
    },
  })
  @Get(':medicationId')
  async getMedication(
    @Param('medicationId') medicationId: string,
    @Req() request: Request,
  ): Promise<MedicationDto> {
    const user = request.user;

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.medicationsService.findById(medicationId);
  }

  @ApiDocumentation({
    operation: {
      summary: 'Create medication',
      description: 'Create medication data',
    },
    okResponse: {
      description: 'Medication created',
      type: MedicationDto,
    },
  })
  @Post()
  async create(
    @Body(ValidationPipe) createMeidicationDto: CreateMedicationDto,
    @Req() request: Request,
  ): Promise<MedicationDto> {
    const user = request.user;

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.medicationsService.create(user.id, createMeidicationDto);
  }

  @ApiDocumentation({
    operation: {
      summary: 'Update medication',
      description: 'Update medication data',
    },
    params: {
      name: 'medicationId',
      type: String,
      description: 'Medication ID',
      example: crypto.randomUUID(),
    },
    notFoundResponse: {
      description: 'Medication not found',
    },
    okResponse: {
      description: 'Medication updated',
      type: MedicationDto,
    },
  })
  @Patch(':medicationId')
  async updateMedication(
    @Param('medicationId') medicationId: string,
    @Body(ValidationPipe) updateMedicationDto: UpdateMedicationDto,
    @Req() request: Request,
  ): Promise<MedicationDto> {
    const user = request.user;

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.medicationsService.updateMedication(
      user.id,
      medicationId,
      updateMedicationDto,
    );
  }

  @ApiDocumentation({
    operation: {
      summary: 'Delete medication',
      description: 'Delete medication data',
    },
    params: {
      name: 'medicationId',
      type: String,
      description: 'Medication ID',
      example: crypto.randomUUID(),
    },
    notFoundResponse: {
      description: 'Medication not found',
    },
    conflictResponse: {
      description: 'Medication is being used in an EMR/prescription',
    },
    okResponse: {
      description: 'Medication deleted',
      type: MedicationDto,
    },
  })
  @Delete(':medicationId')
  async deleteMedication(
    @Param('medicationId') medicationId: string,
    @Req() request: Request,
  ): Promise<MedicationDto> {
    const user = request.user;

    if (!user.isSuperAdmin) {
      throw new UnauthorizedException();
    }

    return this.medicationsService.deleteMedication(user.id, medicationId);
  }
}
