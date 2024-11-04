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

import { AllergiesService } from './allergies.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

import {
  AllergyDto,
  CreateAllergyDto,
  UpdateAllergyDto,
} from './dto/allergies.dto';
import { ApiDocumentation } from 'src/decorators/documentation.decorator';

@ApiDocumentation({
  tags: 'Allergies',
  security: 'bearer',
  unauthorizedResponse: { description: 'Unauthorized' },
  badRequestResponse: { description: 'Bad Request' },
})
@UseGuards(JwtGuard)
@Controller('settings/allergies')
export class AllergiesController {
  constructor(private readonly allergiesService: AllergiesService) {}

  @ApiDocumentation({
    operation: {
      summary: 'Get all allergies',
      description: 'Get all allergies data',
    },
    okResponse: {
      description: 'Allergies data',
      type: [AllergyDto],
    },
  })
  @Get()
  async getAllAllergies(@Req() request: Request): Promise<AllergyDto[]> {
    const user = request.user;

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.allergiesService.findAll();
  }

  @ApiDocumentation({
    operation: {
      summary: 'Get allergy by ID',
      description: 'Get allergy data by ID',
    },
    params: {
      name: 'allergyId',
      type: String,
      description: 'Allergy ID',
      example: crypto.randomUUID(),
    },
    notFoundResponse: {
      description: 'Allergy not found',
    },
    okResponse: {
      description: 'Allergy data',
      type: AllergyDto,
    },
  })
  @Get(':allergyId')
  async getAllergyById(
    @Param('allergyId') allergyId: string,
    @Req() request: Request,
  ): Promise<AllergyDto> {
    const user = request.user;

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    const allergy = await this.allergiesService.findById(allergyId);

    return allergy;
  }

  @ApiDocumentation({
    operation: {
      summary: 'Create allergy',
      description: 'Create a new allergy',
    },
    okResponse: {
      description: 'Allergy created',
      type: AllergyDto,
    },
  })
  @Post()
  async createAllergy(
    @Body(ValidationPipe) dto: CreateAllergyDto,
    @Req() request: Request,
  ): Promise<AllergyDto> {
    const user = request.user;

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }
    return this.allergiesService.create(user.id, dto);
  }

  @ApiDocumentation({
    operation: {
      summary: 'Update allergy',
      description: 'Update allergy by ID',
    },
    params: {
      name: 'allergyId',
      type: String,
      description: 'Allergy ID',
      example: crypto.randomUUID(),
    },
    notFoundResponse: {
      description: 'Allergy not found',
    },
    okResponse: {
      description: 'Allergy updated',
    },
  })
  @Patch(':allergyId')
  async updateAllergy(
    @Param('allergyId') allergyId: string,
    @Body(ValidationPipe) updateAllergyDto: UpdateAllergyDto,
    @Req() request: Request,
  ): Promise<AllergyDto> {
    const user = request.user;

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.allergiesService.update(user.id, allergyId, updateAllergyDto);
  }

  @ApiDocumentation({
    operation: {
      summary: 'Delete allergy',
      description: 'Delete allergy by ID',
    },
    params: {
      name: 'allergyId',
      type: String,
      description: 'Allergy ID',
      example: crypto.randomUUID(),
    },
    notFoundResponse: {
      description: 'Allergy not found',
    },
    conflictResponse: {
      description: 'Allergy is being used in an EMR',
    },
    okResponse: {
      description: 'Allergy deleted',
      type: AllergyDto,
    },
  })
  @Delete(':allergyId')
  async deleteAllergy(
    @Param('allergyId') allergyId: string,
    @Req() request: Request,
  ): Promise<AllergyDto> {
    const user = request.user;

    if (!user.isSuperAdmin) {
      throw new UnauthorizedException();
    }

    return this.allergiesService.delete(user.id, allergyId);
  }
}
