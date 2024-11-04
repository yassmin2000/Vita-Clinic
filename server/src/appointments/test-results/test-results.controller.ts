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

import { TestResultsService } from './test-results.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

import {
  BasicLaboratoryTestResultDto,
  CreateLaboratoryTestResultDto,
  UpdateLaboratoryTestResultDto,
} from './dto/test-results.dto';
import { ApiDocumentation } from 'src/decorators/documentation.decorator';

@ApiDocumentation({
  tags: 'Test Results',
  security: 'bearer',
  unauthorizedResponse: {
    description: 'Unauthorized',
  },
  badRequestResponse: {
    description: 'Bad Request',
  },
})
@UseGuards(JwtGuard)
@Controller('test-results')
export class TestResultsController {
  constructor(private readonly testResultsService: TestResultsService) {}

  @ApiDocumentation({
    operation: {
      summary: 'Create a test result',
      description: 'Create a laboratory test result for an appointment',
    },
    body: {
      description: 'Test result data',
      type: CreateLaboratoryTestResultDto,
    },
    consumes: 'application/json',
    notFoundResponse: {
      description: 'Appointment/Laboratory test/Biomarker not found',
    },
    createdResponse: {
      description: 'Test result created',
      type: BasicLaboratoryTestResultDto,
    },
  })
  @Post()
  async createTestResults(
    @Body(ValidationPipe) dto: CreateLaboratoryTestResultDto,
    @Req() request: Request,
  ): Promise<BasicLaboratoryTestResultDto> {
    const user = request.user;

    if (user.role !== 'doctor') {
      throw new UnauthorizedException();
    }

    return this.testResultsService.create(dto, user.id);
  }

  @ApiDocumentation({
    operation: {
      summary: 'Update a test result',
      description: 'Update a laboratory test result',
    },
    params: {
      name: 'id',
      type: String,
      description: 'Test result ID',
      example: crypto.randomUUID(),
    },
    body: {
      description: 'Test result data',
      type: UpdateLaboratoryTestResultDto,
    },
    consumes: 'application/json',
    notFoundResponse: {
      description: 'Test result not found',
    },
    okResponse: {
      description: 'Test result updated',
      type: BasicLaboratoryTestResultDto,
    },
  })
  @Patch(':id')
  async updateTestResults(
    @Param('id') id: string,
    @Body(ValidationPipe) dto: UpdateLaboratoryTestResultDto,
    @Req() request: Request,
  ): Promise<BasicLaboratoryTestResultDto> {
    const user = request.user;

    if (user.role !== 'doctor') {
      throw new UnauthorizedException();
    }

    return this.testResultsService.update(id, dto, user.id);
  }
}
