import type { Request } from 'express';
import {
  Controller,
  Body,
  Get,
  Req,
  UnauthorizedException,
  UseGuards,
  Patch,
  Param,
} from '@nestjs/common';

import { VitalsService } from './vitals.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

import {
  AllVitalsDataDto,
  BasicVitalsDto,
  UpdateVitalsDto,
} from './dto/vitals.dto';
import { ApiDocumentation } from 'src/decorators/documentation.decorator';

@ApiDocumentation({
  tags: 'Vitals',
  security: 'bearer',
  unauthorizedResponse: {
    description: 'Unauthorized',
  },
  badRequestResponse: {
    description: 'Bad Request',
  },
})
@UseGuards(JwtGuard)
@Controller('vitals')
export class VitalsController {
  constructor(private readonly vitalsService: VitalsService) {}

  @ApiDocumentation({
    operation: {
      summary: 'Get vitals',
      description: 'Get vitals data for the patient',
    },
    okResponse: {
      description: 'Vitals data',
      type: [AllVitalsDataDto],
    },
  })
  @Get()
  async getVitals(@Req() request: Request): Promise<AllVitalsDataDto[]> {
    const user = request.user;

    if (user.role !== 'patient') {
      throw new UnauthorizedException();
    }

    return this.vitalsService.getVitalsData(user.id);
  }

  @ApiDocumentation({
    operation: {
      summary: 'Get latest vitals',
      description: 'Get latest vitals data for the patient',
    },
    okResponse: {
      description: 'Latest vitals data',
      type: BasicVitalsDto,
    },
  })
  @Get('latest')
  async getLatestVitals(@Req() request: Request): Promise<BasicVitalsDto> {
    const user = request.user;

    if (user.role !== 'patient') {
      throw new UnauthorizedException();
    }

    return this.vitalsService.getLatestByPatientId(user.id);
  }

  @ApiDocumentation({
    operation: {
      summary: 'Update vitals',
      description: 'Update vitals data for the patient',
    },
    params: {
      name: 'vitalsId',
      type: String,
      description: 'Vitals ID',
      example: crypto.randomUUID(),
    },
    body: {
      description: 'Vitals data',
      type: UpdateVitalsDto,
    },
    consumes: 'application/json',
    notFoundResponse: {
      description: 'Vitals not found',
    },
    okResponse: {
      description: 'Vitals data updated',
      type: UpdateVitalsDto,
    },
  })
  @Patch(':vitalsId')
  async updateVitals(
    @Param('vitalsId') vitalsId: string,
    @Body() updateVitalsDto: UpdateVitalsDto,
    @Req() request: Request,
  ) {
    const user = request.user;

    if (user.role !== 'doctor') {
      throw new UnauthorizedException();
    }

    return this.vitalsService.update(vitalsId, updateVitalsDto);
  }
}
