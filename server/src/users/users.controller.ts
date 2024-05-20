import { Request } from 'express';
import {
  Controller,
  UseGuards,
  Req,
  UnauthorizedException,
  Post,
  Body,
  ValidationPipe,
  Patch,
  Param,
  Get,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

import {
  CreateUserDto,
  UpdateAvatarDto,
  UpdatePasswordDto,
} from './dto/users.dto';
import type { Payload } from 'src/types/payload.type';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @UseGuards(JwtGuard)
  @Get('profile')
  async getUserProfile(@Req() request: Request) {
    const user: Payload = request['user'];

    return this.userService.findProfileById(user.id, false);
  }

  @UseGuards(JwtGuard)
  @Get('profile/:id')
  async getUserProfileById(@Param('id') id: string, @Req() request: Request) {
    const user: Payload = request['user'];

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.userService.findProfileById(id, user.isSuperAdmin);
  }

  @UseGuards(JwtGuard)
  @Post()
  async createUser(
    @Body(ValidationPipe) dto: CreateUserDto,
    @Req() request: Request,
  ) {
    const user: Payload = request['user'];

    if (user.role !== 'admin') {
      throw new UnauthorizedException();
    }

    if (dto.role === 'admin' && !user.isSuperAdmin) {
      throw new UnauthorizedException();
    }

    return this.userService.create(dto, dto.role || 'patient', true, user.id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id/deactivate')
  async deactivateUser(@Param('id') id: string, @Req() request: Request) {
    const user: Payload = request['user'];

    if (!user.isSuperAdmin) {
      throw new UnauthorizedException();
    }

    return this.userService.deactivate(id, user.id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id/activate')
  async activateUser(@Param('id') id: string, @Req() request: Request) {
    const user: Payload = request['user'];

    if (!user.isSuperAdmin) {
      throw new UnauthorizedException();
    }

    return this.userService.activate(id, user.id);
  }

  @UseGuards(JwtGuard)
  @Patch('avatar')
  async updateUserAvatar(
    @Req() request: Request,
    @Body(ValidationPipe) dto: UpdateAvatarDto,
  ) {
    const user: Payload = request['user'];

    return this.userService.updateAvatar(user.id, dto);
  }

  @UseGuards(JwtGuard)
  @Patch('password')
  async updateUserPassword(
    @Req() request: Request,
    @Body(ValidationPipe) dto: UpdatePasswordDto,
  ) {
    const user: Payload = request['user'];

    return this.userService.updatePassword(user.id, dto);
  }
}
