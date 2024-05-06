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
  async getAllLaboratoryTests() {
    return this.laboratoryTestsService.findAll();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async getLaboratoryTestById(
    @Param('id') id: string,
    @Req() request: Request,
  ) {
    const user: Payload = request['user'];

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.laboratoryTestsService.findById(id);
  }

  @UseGuards(JwtGuard)
  @Post()
  async createLaboratoryTest(
    @Body(ValidationPipe) dto: CreateLaboratoryTestDto,
    @Req() request: Request,
  ) {
    const user: Payload = request['user'];

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }
    return this.laboratoryTestsService.create(user.id, dto);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async updateLaboratoryTest(
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
  async deleteLaboratoryTest(@Param('id') id: string, @Req() request: Request) {
    const user: Payload = request['user'];

    if (!user.isSuperAdmin) {
      throw new UnauthorizedException();
    }

    return this.laboratoryTestsService.delete(id);
  }
}
