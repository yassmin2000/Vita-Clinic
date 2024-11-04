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

import { SurgeriesService } from './surgeries.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

import {
  CreateSurgeryDto,
  SurgeryDto,
  UpdateSurgeryDto,
} from './dto/surgeries.dto';
import { ApiDocumentation } from 'src/decorators/documentation.decorator';

@ApiDocumentation({
  tags: 'Surgeries',
  security: 'bearer',
  unauthorizedResponse: {
    description: 'Unauthorized',
  },
  badRequestResponse: {
    description: 'Bad request',
  },
})
@UseGuards(JwtGuard)
@Controller('settings/surgeries')
export class SurgeriesController {
  constructor(private readonly surgeriesService: SurgeriesService) {}

  @ApiDocumentation({
    operation: {
      summary: 'Get all surgeries',
      description: 'Get all surgeries data',
    },
    okResponse: {
      description: 'Surgeries data',
      type: [SurgeryDto],
    },
  })
  @Get()
  async getAllSurgeries(@Req() request: Request): Promise<SurgeryDto[]> {
    const user = request.user;

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.surgeriesService.findAll();
  }

  @ApiDocumentation({
    operation: {
      summary: 'Get surgery by ID',
      description: 'Get surgery data by ID',
    },
    params: {
      name: 'surgeryId',
      type: String,
      description: 'Surgery ID',
      example: crypto.randomUUID(),
    },
    notFoundResponse: {
      description: 'Surgery not found',
    },
    okResponse: {
      description: 'Surgery data',
      type: SurgeryDto,
    },
  })
  @Get(':surgeryId')
  async getSurgeryById(
    @Param('surgeryId') surgeryId: string,
    @Req() request: Request,
  ): Promise<SurgeryDto> {
    const user = request.user;

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    const surgery = await this.surgeriesService.findById(surgeryId);

    return surgery;
  }

  @ApiDocumentation({
    operation: {
      summary: 'Create surgery',
      description: 'Create a new surgery',
    },
    okResponse: {
      description: 'Surgery created',
      type: SurgeryDto,
    },
  })
  @Post()
  async createSurgery(
    @Body(ValidationPipe) dto: CreateSurgeryDto,
    @Req() request: Request,
  ): Promise<SurgeryDto> {
    const user = request.user;

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }
    return this.surgeriesService.create(user.id, dto);
  }

  @ApiDocumentation({
    operation: {
      summary: 'Update surgery',
      description: 'Update surgery data',
    },
    params: {
      name: 'surgeryId',
      type: String,
      description: 'Surgery ID',
      example: crypto.randomUUID(),
    },
    notFoundResponse: {
      description: 'Surgery not found',
    },
    okResponse: {
      description: 'Surgery updated',
      type: SurgeryDto,
    },
  })
  @Patch(':surgeryId')
  async updateSurgery(
    @Param('surgeryId') surgeryId: string,
    @Body(ValidationPipe) updateSurgeryDto: UpdateSurgeryDto,
    @Req() request: Request,
  ): Promise<SurgeryDto> {
    const user = request.user;

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.surgeriesService.update(user.id, surgeryId, updateSurgeryDto);
  }

  @ApiDocumentation({
    operation: {
      summary: 'Delete surgery',
      description: 'Delete surgery data',
    },
    params: {
      name: 'surgeryId',
      type: String,
      description: 'Surgery ID',
      example: crypto.randomUUID(),
    },
    notFoundResponse: {
      description: 'Surgery not found',
    },
    conflictResponse: {
      description: 'Surgery is being used in an EMR',
    },
    okResponse: {
      description: 'Surgery deleted',
    },
  })
  @Delete(':surgeryId')
  async deleteSurgery(
    @Param('surgeryId') surgeryId: string,
    @Req() request: Request,
  ) {
    const user = request.user;

    if (!user.isSuperAdmin) {
      throw new UnauthorizedException();
    }

    return this.surgeriesService.delete(user.id, surgeryId);
  }
}
