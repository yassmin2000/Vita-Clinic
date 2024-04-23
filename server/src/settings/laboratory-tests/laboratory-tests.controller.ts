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

import { LaboratoryTestsService } from './laboratory-tests.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

import {
  CreateLaboratoryTestDto,
  UpdateLaboratoryTestDto,
} from './dto/laboratory-test.dto';
import type { Payload } from 'src/types/payload.type';

@Controller('settings/laboratory-tests')
export class LaboratoryTestsController {
  constructor(
    private readonly laboratoryTestsService: LaboratoryTestsService,
  ) {}

  @UseGuards(JwtGuard)
  @Get()
  async getAllLabTests(@Req() request: Request) {
    const user: Payload = request['user'];

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.laboratoryTestsService.findAll();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async getlabTestById(@Param('id') id: string, @Req() request: Request) {
    const user: Payload = request['user'];

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    const labTest = await this.laboratoryTestsService.findById(id);

    return labTest;
  }

  @UseGuards(JwtGuard)
  @Post()
  async createLabTest(
    @Body(ValidationPipe) dto: CreateLaboratoryTestDto,
    @Req() request: Request,
  ) {
    const user: Payload = request['user'];
    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }
    return this.laboratoryTestsService.create(dto);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async updateLabTest(
    @Param('id') id: string,
    @Body(ValidationPipe) dto: UpdateLaboratoryTestDto,
    @Req() request: Request,
  ) {
    const user: Payload = request['user'];

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }
    return this.laboratoryTestsService.update(id, dto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async deleteLabTest(@Param('id') id: string, @Req() request: Request) {
    const user: Payload = request['user'];

    if (!user.isSuperAdmin) {
      throw new UnauthorizedException();
    }

    return this.laboratoryTestsService.delete(id);
  }
}
