import { Request } from 'express';
import {
  Controller,
  UseGuards,
  Req,
  UnauthorizedException,
  Post,
  Body,
  ValidationPipe,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

import { CreateUserDto } from './dto/users.dto';
import type { Payload } from 'src/types/payload.type';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

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

    return this.userService.create(dto, dto.role, true);
  }
}
