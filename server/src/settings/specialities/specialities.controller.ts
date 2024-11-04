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

import { SpecialitiesService } from './specialities.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

import {
  CreateSpecialityDto,
  SpecialityDto,
  UpdateSpecialityDto,
} from './dto/specialities.dto';
import { ApiDocumentation } from 'src/decorators/documentation.decorator';

@ApiDocumentation({
  tags: 'Specialities',
  security: 'bearer',
  unauthorizedResponse: {
    description: 'Unauthorized',
  },
  badRequestResponse: {
    description: 'Bad request',
  },
})
@UseGuards(JwtGuard)
@Controller('settings/specialities')
export class SpecialitiesController {
  constructor(private readonly specialitiesService: SpecialitiesService) {}

  @ApiDocumentation({
    operation: {
      summary: 'Get all specialities',
      description: 'Get all specialities data',
    },
    okResponse: {
      description: 'Specialities data',
      type: [SpecialityDto],
    },
  })
  @Get()
  async getAllSpecialities(@Req() request: Request) {
    const user = request.user;

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.specialitiesService.findAll();
  }

  @ApiDocumentation({
    operation: {
      summary: 'Get speciality by ID',
      description: 'Get speciality data by ID',
    },
    params: {
      name: 'specialityId',
      type: String,
      description: 'Speciality ID',
      example: crypto.randomUUID(),
    },
    notFoundResponse: {
      description: 'Speciality not found',
    },
    okResponse: {
      description: 'Speciality data',
      type: SpecialityDto,
    },
  })
  @Get(':specialityId')
  async getSpecialityById(
    @Param('specialityId') specialityId: string,
    @Req() request: Request,
  ) {
    const user = request.user;

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    const speciality = await this.specialitiesService.findById(specialityId);

    return speciality;
  }

  @ApiDocumentation({
    operation: {
      summary: 'Create speciality',
      description: 'Create speciality data',
    },
    okResponse: {
      description: 'Speciality created',
      type: SpecialityDto,
    },
  })
  @Post()
  async createSpeciality(
    @Body(ValidationPipe) dto: CreateSpecialityDto,
    @Req() request: Request,
  ) {
    const user = request.user;

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }
    return this.specialitiesService.create(user.id, dto);
  }

  @ApiDocumentation({
    operation: {
      summary: 'Update speciality',
      description: 'Update speciality data',
    },
    params: {
      name: 'specialityId',
      type: String,
      description: 'Speciality ID',
      example: crypto.randomUUID(),
    },
    notFoundResponse: {
      description: 'Speciality not found',
    },
    okResponse: {
      description: 'Speciality updated',
      type: SpecialityDto,
    },
  })
  @Patch(':specialityId')
  async updateSpeciality(
    @Param('specialityId') specialityId: string,
    @Body(ValidationPipe) updateSpecialityDto: UpdateSpecialityDto,
    @Req() request: Request,
  ) {
    const user = request.user;

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.specialitiesService.update(
      user.id,
      specialityId,
      updateSpecialityDto,
    );
  }

  @ApiDocumentation({
    operation: {
      summary: 'Delete speciality',
      description: 'Delete speciality data',
    },
    params: {
      name: 'specialityId',
      type: String,
      description: 'Speciality ID',
      example: crypto.randomUUID(),
    },
    notFoundResponse: {
      description: 'Speciality not found',
    },
    conflictResponse: {
      description: 'Speciality is being used by a doctor',
    },
    okResponse: {
      description: 'Speciality deleted',
      type: SpecialityDto,
    },
  })
  @Delete(':specialityId')
  async deleteSpeciality(
    @Param('specialityId') specialityId: string,
    @Req() request: Request,
  ) {
    const user = request.user;

    if (!user.isSuperAdmin) {
      throw new UnauthorizedException();
    }

    return this.specialitiesService.delete(user.id, specialityId);
  }
}
