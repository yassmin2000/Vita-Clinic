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

import { TherapiesService } from './therapies.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

import {
  CreateTherapyDto,
  TherapyDto,
  UpdateTherapyDto,
} from './dto/therapies.dto';
import { ApiDocumentation } from 'src/decorators/documentation.decorator';

@ApiDocumentation({
  tags: 'Therapies',
  security: 'bearer',
  unauthorizedResponse: {
    description: 'Unauthorized',
  },
  badRequestResponse: {
    description: 'Bad request',
  },
})
@UseGuards(JwtGuard)
@Controller('settings/therapies')
export class TherapiesController {
  constructor(private readonly therapiesService: TherapiesService) {}

  @ApiDocumentation({
    operation: {
      summary: 'Get all therapies',
      description: 'Get all therapies data',
    },
    okResponse: {
      description: 'Therapies data',
      type: [TherapyDto],
    },
  })
  @Get()
  async getAllTherapies(): Promise<TherapyDto[]> {
    return this.therapiesService.findAll();
  }

  @ApiDocumentation({
    operation: {
      summary: 'Get therapy by ID',
      description: 'Get therapy data by ID',
    },
    params: {
      name: 'therapyId',
      type: String,
      description: 'Therapy ID',
      example: crypto.randomUUID(),
    },
    notFoundResponse: {
      description: 'Therapy not found',
    },
    okResponse: {
      description: 'Therapy data',
      type: TherapyDto,
    },
  })
  @Get(':therapyId')
  async getByID(
    @Param('therapyId') therapyId: string,
    @Req() request: Request,
  ): Promise<TherapyDto> {
    const user = request.user;

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    const therapy = await this.therapiesService.findById(therapyId);

    return therapy;
  }

  @ApiDocumentation({
    operation: {
      summary: 'Create therapy',
      description: 'Create a new therapy',
    },
    okResponse: {
      description: 'Therapy created',
      type: TherapyDto,
    },
  })
  @Post()
  async createTherapy(
    @Body(ValidationPipe) dto: CreateTherapyDto,
    @Req() request: Request,
  ): Promise<TherapyDto> {
    const user = request.user;

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }
    return this.therapiesService.create(user.id, dto);
  }

  @ApiDocumentation({
    operation: {
      summary: 'Update therapy',
      description: 'Update therapy data',
    },
    params: {
      name: 'therapyId',
      type: String,
      description: 'Therapy ID',
      example: crypto.randomUUID(),
    },
    notFoundResponse: {
      description: 'Therapy not found',
    },
    okResponse: {
      description: 'Therapy updated',
      type: TherapyDto,
    },
  })
  @Patch(':therapyId')
  async updateTherapy(
    @Param('therapyId') therapyId: string,
    @Body(ValidationPipe) updateTherapyDto: UpdateTherapyDto,
    @Req() request: Request,
  ): Promise<TherapyDto> {
    const user = request.user;

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.therapiesService.update(user.id, therapyId, updateTherapyDto);
  }

  @ApiDocumentation({
    operation: {
      summary: 'Delete therapy',
      description: 'Delete therapy data',
    },
    params: {
      name: 'therapyId',
      type: String,
      description: 'Therapy ID',
      example: crypto.randomUUID(),
    },
    notFoundResponse: {
      description: 'Therapy not found',
    },
    conflictResponse: {
      description: 'Therapy is being used in a treatment',
    },
    okResponse: {
      description: 'Therapy deleted',
      type: TherapyDto,
    },
  })
  @Delete(':therapyId')
  async deleteTherapy(
    @Param('therapyId') therapyId: string,
    @Req() request: Request,
  ): Promise<TherapyDto> {
    const user = request.user;

    if (!user.isSuperAdmin) {
      throw new UnauthorizedException();
    }

    return this.therapiesService.delete(user.id, therapyId);
  }
}
