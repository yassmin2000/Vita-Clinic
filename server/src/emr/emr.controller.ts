import { Request } from 'express';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UnauthorizedException,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';

import { EmrService } from './emr.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

import { EmrDto } from './dto/emr.dto';
import type { Payload } from 'src/types/payload.type';

@Controller('emr')
export class EmrController {
  constructor(private emrService: EmrService) {}

  @UseGuards(JwtGuard)
  @Get(':id')
  async getById(@Param('id') id: string, @Req() request: Request) {
    const user: Payload = request['user'];

    if (user.role === 'patient' && user.id !== id) {
      throw new UnauthorizedException();
    }

    return this.emrService.getById(id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe())
    emrDto: EmrDto,
    @Req() request: Request,
  ) {
    const user: Payload = request['user'];

    if (user.role !== 'doctor') {
      throw new UnauthorizedException();
    }

    return this.emrService.update(id, emrDto, user.id);
  }
}
