import {
  Controller,
  Get,
  Param,
  UseGuards,
  Req,
  UnauthorizedException,
  NotFoundException,
  Post,
  Body,
} from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from './users.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Payload } from 'src/types/payload.type';
import { CreateUserDto } from './dto/users.dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @UseGuards(JwtGuard)
  @Get(':id')
  async getUserProfile(@Param('id') id: string, @Req() request: Request) {
    const user: Payload = request['user'];

    if (user.id !== id && user.role !== 'admin') {
      throw new UnauthorizedException();
    }

    const profile = await this.userService.findById(id);
    if (!profile) {
      throw new NotFoundException();
    }

    const { password, isEmailVerified, isPhoneVerified, ...result } = profile;
    return result;
  }

  @UseGuards(JwtGuard)
  @Post()
  async createNewUser(@Body() dto: CreateUserDto, @Req() request: Request) {
    const user: Payload = request['user'];

    if (user.role !== 'admin') {
      throw new UnauthorizedException();
    }

    if (dto.role === 'admin') {
      throw new UnauthorizedException();
    }

    return await this.userService.create(dto, dto.role, true);
  }
}
