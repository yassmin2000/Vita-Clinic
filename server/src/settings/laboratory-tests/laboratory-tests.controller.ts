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

import { LaboratoryTestsService } from './laboratory-tests.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

import {
  CreateLaboratoryTestDto,
  LaboratoryTestDto,
  UpdateLaboratoryTestDto,
} from './dto/laboratory-test.dto';
import { ApiDocumentation } from 'src/decorators/documentation.decorator';

@ApiDocumentation({
  tags: 'Laboratory Tests',
  security: 'bearer',
  unauthorizedResponse: {
    description: 'Unauthorized',
  },
  badRequestResponse: {
    description: 'Bad Request',
  },
})
@UseGuards(JwtGuard)
@Controller('settings/laboratory-tests')
export class LaboratoryTestsController {
  constructor(
    private readonly laboratoryTestsService: LaboratoryTestsService,
  ) {}

  @ApiDocumentation({
    operation: {
      summary: 'Get all laboratory tests',
      description: 'Get all laboratory tests data',
    },
    okResponse: {
      description: 'Laboratory tests data',
      type: [LaboratoryTestDto],
    },
  })
  @Get()
  async getAllLaboratoryTests(): Promise<LaboratoryTestDto[]> {
    return this.laboratoryTestsService.findAll();
  }

  @ApiDocumentation({
    operation: {
      summary: 'Get laboratory test by ID',
      description: 'Get laboratory test data by ID',
    },
    params: {
      name: 'laboratoryTestId',
      type: String,
      description: 'Laboratory test ID',
      example: crypto.randomUUID(),
    },
    notFoundResponse: {
      description: 'Laboratory test not found',
    },
    okResponse: {
      description: 'Laboratory test data',
      type: LaboratoryTestDto,
    },
  })
  @Get(':laboratoryTestId')
  async getLaboratoryTestById(
    @Param('laboratoryTestId') laboratoryTestId: string,
    @Req() request: Request,
  ): Promise<LaboratoryTestDto> {
    const user = request.user;

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.laboratoryTestsService.findById(laboratoryTestId);
  }

  @ApiDocumentation({
    operation: {
      summary: 'Create laboratory test',
      description: 'Create new laboratory test',
    },
    createdResponse: {
      description: 'Laboratory test created',
      type: LaboratoryTestDto,
    },
  })
  @Post()
  async createLaboratoryTest(
    @Body(ValidationPipe) dto: CreateLaboratoryTestDto,
    @Req() request: Request,
  ): Promise<LaboratoryTestDto> {
    const user = request.user;

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }
    return this.laboratoryTestsService.create(user.id, dto);
  }

  @ApiDocumentation({
    operation: {
      summary: 'Update laboratory test',
      description: 'Update laboratory test data',
    },
    params: {
      name: 'laboratoryTestId',
      type: String,
      description: 'Laboratory test ID',
      example: crypto.randomUUID(),
    },
    notFoundResponse: {
      description: 'Laboratory test not found',
    },
    okResponse: {
      description: 'Laboratory test updated',
      type: LaboratoryTestDto,
    },
  })
  @Patch(':laboratoryTestId')
  async updateLaboratoryTest(
    @Param('laboratoryTestId') laboratoryTestId: string,
    @Body(ValidationPipe) dto: UpdateLaboratoryTestDto,
    @Req() request: Request,
  ): Promise<LaboratoryTestDto> {
    const user = request.user;

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.laboratoryTestsService.update(user.id, laboratoryTestId, dto);
  }

  @ApiDocumentation({
    operation: {
      summary: 'Delete laboratory test',
      description: 'Delete laboratory test data',
    },
    params: {
      name: 'laboratoryTestId',
      type: String,
      description: 'Laboratory test ID',
      example: crypto.randomUUID(),
    },
    notFoundResponse: {
      description: 'Laboratory test not found',
    },
    conflictResponse: {
      description: 'Laboratory test is being used',
    },
    okResponse: {
      description: 'Laboratory test deleted',
      type: LaboratoryTestDto,
    },
  })
  @Delete(':laboratoryTestId')
  async deleteLaboratoryTest(
    @Param('laboratoryTestId') laboratoryTestId: string,
    @Req() request: Request,
  ): Promise<LaboratoryTestDto> {
    const user = request.user;

    if (!user.isSuperAdmin) {
      throw new UnauthorizedException();
    }

    return this.laboratoryTestsService.delete(user.id, laboratoryTestId);
  }
}
