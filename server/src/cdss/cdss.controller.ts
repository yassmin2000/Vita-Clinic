import type { Request } from 'express';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';

import { JwtGuard } from 'src/auth/guards/jwt.guard';

import { ApiDocumentation } from 'src/decorators/documentation.decorator';
import { CdssService } from './cdss.service';
import {
  ApprovePredictionDto,
  CreatePredictionDto,
  PredictionDto,
  RejectPredictionDto,
  UpdatePredictionResultDto,
} from './dto/cdss.dto';
import { APIKeyGuard } from 'src/auth/guards/api-key.guard';

@ApiDocumentation({
  tags: 'CDSS',
  security: 'bearer',
  unauthorizedResponse: {
    description: 'Unauthorized',
  },
  badRequestResponse: {
    description: 'Bad Request',
  },
})
@Controller('cdss')
export class CdssController {
  constructor(private readonly cdssService: CdssService) {}

  @ApiDocumentation({
    operation: {
      summary: 'Get prediction by ID',
      description: 'Get certain prediction data by ID',
    },
    params: {
      name: 'predictionId',
      type: String,
      description: 'Prediction ID',
      example: crypto.randomUUID(),
    },
    notFoundResponse: {
      description: 'Prediction not found',
    },
    okResponse: {
      description: 'Prediction data',
      type: PredictionDto,
    },
  })
  @UseGuards(JwtGuard)
  @Get(':predictionId')
  async getPredictionById(
    @Param('predictionId') predictionId: string,
    @Req() request: Request,
  ): Promise<PredictionDto> {
    const user = request.user;

    return this.cdssService.getPrediction(predictionId, user.id);
  }

  @ApiDocumentation({
    operation: {
      summary: 'Create a prediction',
      description: 'Create a prediction',
    },
    body: {
      description: 'Prediction data',
      type: CreatePredictionDto,
    },
    consumes: 'application/json',
    notFoundResponse: {
      description: 'Instance not found',
    },
    createdResponse: {
      description: 'Prediction created',
      type: PredictionDto,
    },
  })
  @UseGuards(JwtGuard)
  @Post()
  async createPrediction(
    @Body(new ValidationPipe({ transform: true })) dto: CreatePredictionDto,
    @Req() request: Request,
  ) {
    const user = request.user;

    if (user.role !== 'doctor') {
      throw new UnauthorizedException();
    }

    return this.cdssService.create(user.id, dto);
  }

  @ApiDocumentation({
    operation: {
      summary: 'Fail a prediction',
      description: 'Fail a prediction',
    },
    params: {
      name: 'predictionId',
      type: String,
      description: 'Prediction ID',
      example: crypto.randomUUID(),
    },
    consumes: 'application/json',
    notFoundResponse: {
      description: 'Prediction not found',
    },
    conflictResponse: {
      description: 'Prediction is not pending',
    },
    okResponse: {
      description: 'Prediction failed',
      type: PredictionDto,
    },
  })
  @UseGuards(new APIKeyGuard('secret'))
  @Patch(':predictionId/fail')
  async failPrediction(
    @Param('predictionId') predictionId: string,
  ): Promise<PredictionDto> {
    return this.cdssService.failPrediction(predictionId);
  }

  @ApiDocumentation({
    operation: {
      summary: 'Update a prediction',
      description: 'Update a prediction',
    },
    params: {
      name: 'predictionId',
      type: String,
      description: 'Prediction ID',
      example: crypto.randomUUID(),
    },
    body: {
      description: 'Prediction results data',
      type: UpdatePredictionResultDto,
    },
    consumes: 'application/json',
    notFoundResponse: {
      description: 'Prediction not found',
    },
    conflictResponse: {
      description: 'Prediction is not pending',
    },
    okResponse: {
      description: 'Prediction updated',
      type: PredictionDto,
    },
  })
  @UseGuards(new APIKeyGuard('secret'))
  @Patch(':predictionId')
  async updatePrediction(
    @Param('predictionId') predictionId: string,
    @Body(new ValidationPipe()) dto: UpdatePredictionResultDto,
  ): Promise<PredictionDto> {
    return this.cdssService.updatePredictionResult(predictionId, dto);
  }

  @ApiDocumentation({
    operation: {
      summary: 'Approve a prediction',
      description: 'Approve a prediction',
    },
    params: {
      name: 'predictionId',
      type: String,
      description: 'Prediction ID',
      example: crypto.randomUUID(),
    },
    body: {
      description: 'Prediction approval data',
      type: ApprovePredictionDto,
    },
    consumes: 'application/json',
    notFoundResponse: {
      description: 'Prediction not found',
    },
    conflictResponse: {
      description: 'Prediction is not pending',
    },
    okResponse: {
      description: 'Prediction approved',
      type: PredictionDto,
    },
  })
  @UseGuards(JwtGuard)
  @Patch(':predictionId/approve')
  async approvePrediction(
    @Param('predictionId') predictionId: string,
    @Body() dto: ApprovePredictionDto,
    @Req() request: Request,
  ): Promise<PredictionDto> {
    const user = request.user;

    return this.cdssService.approvePrediction(user.id, predictionId, dto);
  }

  @ApiDocumentation({
    operation: {
      summary: 'Reject a prediction',
      description: 'Reject a prediction',
    },
    params: {
      name: 'predictionId',
      type: String,
      description: 'Prediction ID',
      example: crypto.randomUUID(),
    },
    body: {
      description: 'Prediction rejection data',
      type: RejectPredictionDto,
    },
    consumes: 'application/json',
    notFoundResponse: {
      description: 'Prediction not found',
    },
    conflictResponse: {
      description: 'Prediction is not pending',
    },
    okResponse: {
      description: 'Prediction rejected',
      type: PredictionDto,
    },
  })
  @UseGuards(JwtGuard)
  @Patch(':predictionId/reject')
  async rejectPrediction(
    @Param('predictionId') predictionId: string,
    @Body() dto: RejectPredictionDto,
    @Req() request: Request,
  ): Promise<PredictionDto> {
    const user = request.user;

    return this.cdssService.rejectPrediction(user.id, predictionId, dto);
  }
}
