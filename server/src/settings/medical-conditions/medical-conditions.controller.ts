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

import { MedicalConditionsService } from './medical-conditions.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

import {
  CreateMedicalConditionDto,
  MedicalConditionDto,
  UpdateMedicalConditionDto,
} from './dto/medical-conditions.dto';
import { ApiDocumentation } from 'src/decorators/documentation.decorator';

@ApiDocumentation({
  tags: 'Medical Conditions',
  security: 'bearer',
  unauthorizedResponse: {
    description: 'Unauthorized',
  },
  badRequestResponse: {
    description: 'Bad Request',
  },
})
@UseGuards(JwtGuard)
@Controller('settings/medical-conditions')
export class MedicalConditionsController {
  constructor(
    private readonly medicalConditionsService: MedicalConditionsService,
  ) {}

  @ApiDocumentation({
    operation: {
      summary: 'Get all medical conditions',
      description: 'Get all medical conditions data',
    },
    okResponse: {
      description: 'Medical conditions data',
      type: [MedicalConditionDto],
    },
  })
  @Get()
  async getAllMedicalConditions(
    @Req() request: Request,
  ): Promise<MedicalConditionDto[]> {
    const user = request.user;

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.medicalConditionsService.findAll();
  }

  @ApiDocumentation({
    operation: {
      summary: 'Get medical condition by ID',
      description: 'Get medical condition data by ID',
    },
    params: {
      name: 'medicalConditionId',
      type: String,
      description: 'Medical condition ID',
      example: crypto.randomUUID(),
    },
    notFoundResponse: {
      description: 'Medical condition not found',
    },
    okResponse: {
      description: 'Medical condition data',
      type: MedicalConditionDto,
    },
  })
  @Get(':medicalConditionId')
  async getMedicalConditionById(
    @Param('medicalConditionId') medicalConditionId: string,
    @Req() request: Request,
  ): Promise<MedicalConditionDto> {
    const user = request.user;

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.medicalConditionsService.findById(medicalConditionId);
  }

  @ApiDocumentation({
    operation: {
      summary: 'Create medical condition',
      description: 'Create medical condition data',
    },
    okResponse: {
      description: 'Medical condition data',
      type: MedicalConditionDto,
    },
  })
  @Post()
  async createMedicalCondition(
    @Body(ValidationPipe) dto: CreateMedicalConditionDto,
    @Req() request: Request,
  ): Promise<MedicalConditionDto> {
    const user = request.user;

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.medicalConditionsService.create(user.id, dto);
  }

  @ApiDocumentation({
    operation: {
      summary: 'Update medical condition',
      description: 'Update medical condition data',
    },
    params: {
      name: 'medicalConditionId',
      type: String,
      description: 'Medical condition ID',
      example: crypto.randomUUID(),
    },
    notFoundResponse: {
      description: 'Medical condition not found',
    },
    okResponse: {
      description: 'Medical condition data',
      type: MedicalConditionDto,
    },
  })
  @Patch(':medicalConditionId')
  async updateMedicalCondition(
    @Param('medicalConditionId') medicalConditionId: string,
    @Body(ValidationPipe) UpdateMedicalConditionDto: UpdateMedicalConditionDto,
    @Req() request: Request,
  ): Promise<MedicalConditionDto> {
    const user = request.user;

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.medicalConditionsService.update(
      user.id,
      medicalConditionId,
      UpdateMedicalConditionDto,
    );
  }

  @ApiDocumentation({
    operation: {
      summary: 'Delete medical condition',
      description: 'Delete medical condition data',
    },
    params: {
      name: 'medicalConditionId',
      type: String,
      description: 'Medical condition ID',
      example: crypto.randomUUID(),
    },
    notFoundResponse: {
      description: 'Medical condition not found',
    },
    conflictResponse: {
      description: 'Medical condition is being used in an EMR',
    },
    okResponse: {
      description: 'Medical condition deleted',
      type: MedicalConditionDto,
    },
  })
  @Delete(':medicalConditionId')
  async deleteMedicalCondition(
    @Param('medicalConditionId') medicalConditionId: string,
    @Req() request: Request,
  ): Promise<MedicalConditionDto> {
    const user = request.user;

    if (!user.isSuperAdmin) {
      throw new UnauthorizedException();
    }

    return this.medicalConditionsService.delete(user.id, medicalConditionId);
  }
}
