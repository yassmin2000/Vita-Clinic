import type { Request } from 'express';
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
import {
  BasicUserDto,
  UserListItemDto,
  UserReturnDto,
} from '../dto/users-response.dto';
import { ApiDocumentation } from 'src/decorators/documentation.decorator';

@ApiDocumentation({
  tags: 'Doctors',
  security: 'bearer',
  unauthorizedResponse: {
    description: 'Unauthorized',
  },
  badRequestResponse: {
    description: 'Bad Request',
  },
})
@UseGuards(JwtGuard)
@Controller('/users/doctors')
export class DoctorsController {
  constructor(
    private readonly usersService: UsersService,
    private readonly doctorsService: DoctorsService,
  ) {}

  @ApiDocumentation({
    operation: {
      summary: 'Get all doctors',
      description: 'Get all doctors data',
    },
    okResponse: {
      description: 'All doctors data',
      type: [UserListItemDto],
    },
  })
  @Get()
  async getAllDoctors(
    @Req() request: Request,
    @Query(new ValidationPipe({ transform: true }))
    query: GetAllUsersQuery,
  ): Promise<UserListItemDto[]> {
    const user = request.user;

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.usersService.findAll(user.isSuperAdmin, 'doctor', {
      ...query,
    });
  }

  @ApiDocumentation({
    operation: {
      summary: 'Get doctors list',
      description: 'Get all doctors data in list format',
    },
    okResponse: {
      description: 'All doctors data in list format',
      type: [BasicUserDto],
    },
  })
  @Get('list')
  async getDoctorsList(@Req() request: Request): Promise<BasicUserDto[]> {
    const user = request.user;

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.usersService.findAllList('doctor');
  }

  @ApiDocumentation({
    operation: {
      summary: 'Update doctor speciality',
      description: 'Update doctor speciality by doctor ID',
    },
    params: {
      name: 'doctorId',
      type: String,
      description: 'Doctor ID',
      example: crypto.randomUUID(),
    },
    body: {
      description: 'Doctor speciality data',
      type: UpdateSpecialityDto,
    },
    consumes: 'application/json',
    notFoundResponse: {
      description: 'Doctor/Speciality not found',
    },
    okResponse: {
      description: 'Doctor speciality updated',
      type: UserReturnDto,
    },
  })
  @Patch(':doctorId/speciality')
  async updateSpeciality(
    @Param('doctorId') doctorId: string,
    @Req() request: Request,
    @Body(new ValidationPipe())
    dto: UpdateSpecialityDto,
  ): Promise<UserReturnDto> {
    const user = request.user;

    if (user.role !== 'admin') {
      throw new UnauthorizedException();
    }

    return this.doctorsService.updateSpeciality(
      doctorId,
      dto.specialityId,
      user.id,
    );
  }
}
