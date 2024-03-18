import { Body, Controller, Post, Put, Req, UseGuards } from '@nestjs/common';
import { CreateUserDto, VerifyUserDto } from 'src/users/dto/users.dto';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { RefreshJwtGuard } from './guards/refresh.guard';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('register')
  async registerUser(@Body() dto: CreateUserDto) {
    return await this.userService.create(dto);
  }

  @Put('verify')
  async verifyUser(@Body() dto: VerifyUserDto) {
    return await this.userService.verify(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return await this.authService.login(dto);
  }

  @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  async refreshToken(@Req() request: Request) {
    const user = request['user'];
    return await this.authService.refreshToken(user);
  }
}
