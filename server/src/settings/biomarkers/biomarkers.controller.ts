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

import { BiomarkersService } from './biomarkers.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

import { CreateBiomarkerDto, UpdateBiomarkerDto } from './dto/biomarkers.dto';
import type { Payload } from 'src/types/payload.type';

@Controller('/settings/biomarkers')
export class BiomarkersController {
  constructor(private readonly biomarkersService: BiomarkersService) {}

  @UseGuards(JwtGuard)
  @Get()
  async getAllBiomarkers(@Req() request: Request) {
    const user: Payload = request['user'];

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.biomarkersService.findAll();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async getBiomarkerById(@Param('id') id: string, @Req() request: Request) {
    const user: Payload = request['user'];

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.biomarkersService.findById(id);
  }

  @UseGuards(JwtGuard)
  @Post()
  async createBiomarker(
    @Body(ValidationPipe) createBiomarkerDto: CreateBiomarkerDto,
    @Req() request: Request,
  ) {
    const user: Payload = request['user'];

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.biomarkersService.create(createBiomarkerDto);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async updateBiomarker(
    @Param('id') id: string,
    @Body(ValidationPipe) updateBiomarkerDto: UpdateBiomarkerDto,
    @Req() request: Request,
  ) {
    const user: Payload = request['user'];

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.biomarkersService.update(id, updateBiomarkerDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async deleteBiomarker(@Param('id') id: string, @Req() request: Request) {
    const user: Payload = request['user'];

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.biomarkersService.delete(id);
  }
}
