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

import { ModalitiesService } from './modalities.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

import { CreateModalityDto, UpdateModalityDto } from './dto/modalities.dto';
import { Payload } from 'src/types/payload.type';

@Controller('settings/modalities')
export class ModalitiesController {
  constructor(private readonly modalitiesService: ModalitiesService) {}

  @UseGuards(JwtGuard)
  @Get()
  async getAllModalities() {
    return this.modalitiesService.findAll();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async getByID(@Param('id') id: string, @Req() request: Request) {
    const user: Payload = request['user'];

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    const modality = await this.modalitiesService.findById(id);

    return modality;
  }

  @UseGuards(JwtGuard)
  @Post()
  async createModality(
    @Body(ValidationPipe) dto: CreateModalityDto,
    @Req() request: Request,
  ) {
    const user: Payload = request['user'];

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }
    return this.modalitiesService.create(user.id, dto);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async updateModality(
    @Param('id') id: string,
    @Body(ValidationPipe) updateModalityDto: UpdateModalityDto,
    @Req() request: Request,
  ) {
    const user: Payload = request['user'];

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.modalitiesService.update(id, updateModalityDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async deleteModality(@Param('id') id: string, @Req() request: Request) {
    const user: Payload = request['user'];

    if (!user.isSuperAdmin) {
      throw new UnauthorizedException();
    }

    return this.modalitiesService.delete(id);
  }
}
