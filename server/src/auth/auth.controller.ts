import { Body, Controller, Post, Put, Req, UseGuards } from '@nestjs/common';
import {
  CreateUserDto,
  ResendEmailVerificationDto,
  ResendPhoneVerificationDto,
  VerifyUserEmailDto,
  VerifyUserPhoneDto,
} from 'src/users/dto/users.dto';
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
    return await this.userService.create(dto, 'patient');
  }

  @Put('verify/email')
  async verifyUserEmail(@Body() dto: VerifyUserEmailDto) {
    return await this.userService.verifyEmail(dto);
  }

  @Post('/resend/email')
  async resendEmailVerification(@Body() dto: ResendEmailVerificationDto) {
    return await this.userService.resendEmailVerification(dto);
  }

  @Put('verify/phone')
  async verifyUserPhone(@Body() dto: VerifyUserPhoneDto) {
    return await this.userService.verifyPhone(dto);
  }

  @Post('/resend/phone')
  async resendPhoneVerification(@Body() dto: ResendPhoneVerificationDto) {
    return await this.userService.resendPhoneVerification(dto);
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
