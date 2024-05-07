import { Request } from 'express';
import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Patch,
  Param,
  ValidationPipe,
  UnauthorizedException,
} from '@nestjs/common';

import { TreatmentService } from './treatments.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

import type { Payload } from 'src/types/payload.type';
import { CreateTreatmentDto, UpdateTreatmentDto } from './dto/treatments.dto';

@Controller('treatments')
export class TreatmentController {
  constructor(private readonly treatmentService: TreatmentService) {}

  @UseGuards(JwtGuard)
  @Post()
  async createTreatment(
    @Body(ValidationPipe) createTreatmentDto: CreateTreatmentDto,
    @Req() request: Request,
  ) {
    const user: Payload = request['user'];

    if (user.role !== 'doctor') {
      throw new UnauthorizedException();
    }

    return this.treatmentService.create(createTreatmentDto);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async updateTreatment(
    @Param('id') id: string,
    @Body(ValidationPipe) updateTreatmentDto: UpdateTreatmentDto,
    @Req() request: Request,
  ) {
    const user: Payload = request['user'];

    if (user.role !== 'doctor') {
      throw new UnauthorizedException();
    }

    return this.treatmentService.update(id, updateTreatmentDto);
  }
}
