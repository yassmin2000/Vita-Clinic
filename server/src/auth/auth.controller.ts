import { Request } from 'express';
import {
  Body,
  Controller,
  Patch,
  Post,
  Put,
  Req,
  UnauthorizedException,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtGuard } from './guards/jwt.guard';
import { RefreshJwtGuard } from './guards/refresh.guard';

import { LoginDto } from './dto/auth.dto';
import {
  CreateUserDto,
  ResendEmailVerificationDto,
  ResendPhoneVerificationDto,
  VerifyUserEmailDto,
  VerifyUserPhoneDto,
} from 'src/users/dto/users.dto';

import type { Payload } from 'src/types/payload.type';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('login')
  async login(@Body(ValidationPipe) dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  async refreshToken(@Req() request: Request) {
    const user: Payload = request['user'];
    return this.authService.refreshToken(user.id);
  }

  @Post('register')
  async registerUser(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto, 'patient');
  }

  @Patch('verify/email')
  async verifyUserEmail(
    @Body(ValidationPipe) verifyUserEmailDto: VerifyUserEmailDto,
  ) {
    return this.userService.verifyEmail(verifyUserEmailDto);
  }

  @Post('/resend/email')
  async resendEmailVerification(
    @Body(ValidationPipe)
    resendEmailVerificationDto: ResendEmailVerificationDto,
  ) {
    return this.userService.resendEmailVerification(resendEmailVerificationDto);
  }

  @UseGuards(JwtGuard)
  @Patch('verify/phone')
  async verifyUserPhone(
    @Body(ValidationPipe) verifyUserPhoneDto: VerifyUserPhoneDto,
    @Req() request: Request,
  ) {
    const user: Payload = request['user'];

    if (
      !user.phoneNumber ||
      user.phoneNumber !== verifyUserPhoneDto.phoneNumber
    ) {
      throw new UnauthorizedException();
    }

    return this.userService.verifyPhone(verifyUserPhoneDto);
  }

  @UseGuards(JwtGuard)
  @Post('/resend/phone')
  async resendPhoneVerification(
    @Body(ValidationPipe)
    resendPhoneVerificationDto: ResendPhoneVerificationDto,
  ) {
    return this.userService.resendPhoneVerification(resendPhoneVerificationDto);
  }
}
