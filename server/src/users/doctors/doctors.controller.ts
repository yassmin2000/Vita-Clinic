import { Request } from 'express';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';

import { UsersService } from '../users.service';
import { DoctorsService } from './doctors.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

import { UpdateSpecialityDto } from './dto/doctors.dto';
import { GetAllUsersQuery } from '../dto/users.dto';
import type { Payload } from 'src/types/payload.type';

@Controller('/users/doctors')
export class DoctorsController {
  constructor(
    private readonly usersService: UsersService,
    private readonly doctorsService: DoctorsService,
  ) {}

  @UseGuards(JwtGuard)
  @Get()
  async getAllDoctors(
    @Req() request: Request,
    @Query(new ValidationPipe({ transform: true }))
    query: GetAllUsersQuery,
  ) {
    const user: Payload = request['user'];

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.usersService.findAll(user.isSuperAdmin, 'doctor', {
      ...query,
    });
  }

  @UseGuards(JwtGuard)
  @Get('list')
  async getDoctorsList(@Req() request: Request) {
    const user: Payload = request['user'];

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.usersService.findAllList('doctor');
  }

  @UseGuards(JwtGuard)
  @Patch(':id/speciality')
  async updateSpeciality(
    @Param('id') id: string,
    @Req() request: Request,
    @Body(new ValidationPipe())
    dto: UpdateSpecialityDto,
  ) {
    const user: Payload = request['user'];

    if (user.role !== 'admin') {
      throw new UnauthorizedException();
    }

    return this.doctorsService.updateSpeciality(id, dto.specialityId);
  }
}
