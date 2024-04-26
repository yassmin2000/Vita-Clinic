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

import { TherapiesService } from './therapies.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

import { CreateTherapyDto, UpdateTherapyDto } from './dto/therapies.dto';
import { Payload } from 'src/types/payload.type';

@Controller('settings/therapies')
export class TherapiesController {
  constructor(private readonly therapiesService: TherapiesService) {}

  @UseGuards(JwtGuard)
  @Get()
  async getAllTherapies(@Req() request: Request) {
    const user: Payload = request['user'];

    return this.therapiesService.findAll();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async getByID(@Param('id') id: string, @Req() request: Request) {
    const user: Payload = request['user'];

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    const therapy = await this.therapiesService.findById(id);

    return therapy;
  }

  @UseGuards(JwtGuard)
  @Post()
  async createTherapy(
    @Body(ValidationPipe) dto: CreateTherapyDto,
    @Req() request: Request,
  ) {
    const user: Payload = request['user'];

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }
    return this.therapiesService.create(dto);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async updateTherapy(
    @Param('id') id: string,
    @Body(ValidationPipe) updateTherapyDto: UpdateTherapyDto,
    @Req() request: Request,
  ) {
    const user: Payload = request['user'];

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.therapiesService.update(id, updateTherapyDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async deleteTherapy(@Param('id') id: string, @Req() request: Request) {
    const user: Payload = request['user'];

    if (!user.isSuperAdmin) {
      throw new UnauthorizedException();
    }

    return this.therapiesService.delete(id);
  }
}
