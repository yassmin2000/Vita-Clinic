import { Request } from 'express';
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

import { ScansService } from './scans.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

import { CreateScanDto, UpdateScanDto } from './dto/scans.dto';
import type { Payload } from 'src/types/payload.type';

@Controller('scans')
export class ScansController {
  constructor(private readonly scansService: ScansService) {}

  @UseGuards(JwtGuard)
  @Get(':id')
  async getScanById(@Param('id') id: string, @Req() request: Request) {
    const user: Payload = request['user'];

    const scan = await this.scansService.findById(id);

    if (user.role === 'patient' && scan.appointment.patientId !== user.id) {
      throw new UnauthorizedException();
    }

    return scan;
  }

  @UseGuards(JwtGuard)
  @Post()
  async createScan(
    @Body(ValidationPipe) dto: CreateScanDto,
    @Req() request: Request,
  ) {
    const user: Payload = request['user'];

    if (user.role !== 'doctor') {
      throw new UnauthorizedException();
    }
    return this.scansService.create(dto);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async updateScan(
    @Param('id') id: string,
    @Body(ValidationPipe) updateScanDto: UpdateScanDto,
    @Req() request: Request,
  ) {
    const user: Payload = request['user'];

    if (user.role !== 'doctor') {
      throw new UnauthorizedException();
    }

    return this.scansService.update(id, updateScanDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async deleteScan(@Param('id') id: string, @Req() request: Request) {
    const user: Payload = request['user'];

    if (!user.isSuperAdmin) {
      throw new UnauthorizedException();
    }

    return this.scansService.delete(id);
  }
}
