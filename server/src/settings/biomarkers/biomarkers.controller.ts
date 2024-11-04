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

import { BiomarkersService } from './biomarkers.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

import {
  BiomarkerDto,
  CreateBiomarkerDto,
  UpdateBiomarkerDto,
} from './dto/biomarkers.dto';
import { ApiDocumentation } from 'src/decorators/documentation.decorator';

@ApiDocumentation({
  tags: 'Biomarkers',
  security: 'bearer',
  unauthorizedResponse: { description: 'Unauthorized' },
  badRequestResponse: { description: 'Bad Request' },
})
@UseGuards(JwtGuard)
@Controller('/settings/biomarkers')
export class BiomarkersController {
  constructor(private readonly biomarkersService: BiomarkersService) {}

  @ApiDocumentation({
    operation: {
      summary: 'Get all biomarkers',
      description: 'Get all biomarkers data',
    },
    okResponse: {
      description: 'Biomarkers data',
      type: [BiomarkerDto],
    },
  })
  @Get()
  async getAllBiomarkers(@Req() request: Request): Promise<BiomarkerDto[]> {
    const user = request.user;

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.biomarkersService.findAll();
  }

  @ApiDocumentation({
    operation: {
      summary: 'Get biomarker by ID',
      description: 'Get biomarker data by ID',
    },
    params: {
      name: 'biomarkerId',
      type: String,
      description: 'Biomarker ID',
      example: crypto.randomUUID(),
    },
    notFoundResponse: {
      description: 'Biomarker not found',
    },
    okResponse: {
      description: 'Biomarker data',
      type: BiomarkerDto,
    },
  })
  @Get(':biomarkerId')
  async getBiomarkerById(
    @Param('biomarkerId') biomarkerId: string,
    @Req() request: Request,
  ): Promise<BiomarkerDto> {
    const user = request.user;

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.biomarkersService.findById(biomarkerId);
  }

  @ApiDocumentation({
    operation: {
      summary: 'Create biomarker',
      description: 'Create new biomarker',
    },
    okResponse: {
      description: 'Biomarker created',
      type: BiomarkerDto,
    },
  })
  @Post()
  async createBiomarker(
    @Body(ValidationPipe) createBiomarkerDto: CreateBiomarkerDto,
    @Req() request: Request,
  ): Promise<BiomarkerDto> {
    const user = request.user;

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.biomarkersService.create(user.id, createBiomarkerDto);
  }

  @ApiDocumentation({
    operation: {
      summary: 'Update biomarker',
      description: 'Update biomarker data',
    },
    params: {
      name: 'biomarkerId',
      type: String,
      description: 'Biomarker ID',
      example: crypto.randomUUID(),
    },
    notFoundResponse: {
      description: 'Biomarker not found',
    },
    okResponse: {
      description: 'Biomarker updated',
    },
  })
  @Patch(':biomarkerId')
  async updateBiomarker(
    @Param('biomarkerId') biomarkerId: string,
    @Body(ValidationPipe) updateBiomarkerDto: UpdateBiomarkerDto,
    @Req() request: Request,
  ): Promise<BiomarkerDto> {
    const user = request.user;

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.biomarkersService.update(
      user.id,
      biomarkerId,
      updateBiomarkerDto,
    );
  }

  @ApiDocumentation({
    operation: {
      summary: 'Delete biomarker',
      description: 'Delete biomarker by ID',
    },
    params: {
      name: 'biomarkerId',
      type: String,
      description: 'Biomarker ID',
      example: crypto.randomUUID(),
    },
    notFoundResponse: {
      description: 'Biomarker not found',
    },
    conflictResponse: {
      description: 'Biomarker is being used in a laboratory test',
    },
    okResponse: {
      description: 'Biomarker deleted',
    },
  })
  @Delete(':biomarkerId')
  async deleteBiomarker(
    @Param('biomarkerId') biomarkerId: string,
    @Req() request: Request,
  ): Promise<BiomarkerDto> {
    const user = request.user;

    if (!user.isSuperAdmin) {
      throw new UnauthorizedException();
    }

    return this.biomarkersService.delete(user.id, biomarkerId);
  }
}
