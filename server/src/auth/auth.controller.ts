import type { Request } from 'express';
import {
  Body,
  Controller,
  Patch,
  Post,
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
import { LoginResponseDto } from './dto/auth-response.dto';
import {
  CreateUserDto,
  ResendEmailVerificationDto,
  ResendPhoneVerificationDto,
  VerifyUserEmailDto,
  VerifyUserPhoneDto,
} from 'src/users/dto/users.dto';
import { UserReturnDto } from 'src/users/dto/users-response.dto';
import { ApiDocumentation } from 'src/decorators/documentation.decorator';

@ApiDocumentation({
  tags: 'Authentication',
  badRequestResponse: {
    description: 'Bad Request',
  },
})
@Controller('auth')
export class AuthController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @ApiDocumentation({
    operation: {
      summary: 'Login user',
      description: 'Login user by email and password',
    },
    body: {
      description: 'User login data',
      type: LoginDto,
    },
    consumes: 'application/json',
    unauthorizedResponse: {
      description: 'Your credentials are invalid',
    },
    createdResponse: {
      description: 'User logged in successfully',
      type: LoginResponseDto,
    },
  })
  @Post('login')
  async login(@Body(ValidationPipe) dto: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(dto);
  }

  @ApiDocumentation({
    operation: {
      summary: 'Refresh token',
      description: 'Refresh JWT token',
    },
    security: 'refresh',
    unauthorizedResponse: {
      description: 'Unauthorized',
    },
    createdResponse: {
      description: 'Token refreshed successfully',
      type: LoginResponseDto,
    },
  })
  @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  async refreshToken(@Req() request: Request): Promise<LoginResponseDto> {
    const user = request.user;
    return this.authService.refreshToken(user.id);
  }

  @ApiDocumentation({
    operation: {
      summary: 'Register user',
      description: 'Register new user',
    },
    body: {
      description: 'User registration data',
      type: CreateUserDto,
    },
    consumes: 'application/json',
    conflictResponse: {
      description: 'Email/phone number/SSN already exists',
    },
    createdResponse: {
      description: 'User registered successfully',
      type: UserReturnDto,
    },
  })
  @Post('register')
  async registerUser(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<UserReturnDto> {
    return this.userService.create(createUserDto, 'patient');
  }

  @ApiDocumentation({
    operation: {
      summary: 'Verify user email',
      description: 'Verify user email by OTP',
    },
    body: {
      description: 'User email verification data',
      type: VerifyUserEmailDto,
    },
    consumes: 'application/json',
    conflictResponse: {
      description: 'Email is already verified/Invalid OTP',
    },
    okResponse: {
      description: 'User email verified successfully',
      type: UserReturnDto,
    },
  })
  @Patch('verify/email')
  async verifyUserEmail(
    @Body(ValidationPipe) verifyUserEmailDto: VerifyUserEmailDto,
  ): Promise<UserReturnDto> {
    return this.userService.verifyEmail(verifyUserEmailDto);
  }

  @ApiDocumentation({
    operation: {
      summary: 'Resend email verification',
      description: 'Resend email verification OTP',
    },
    body: {
      description: 'Resend email verification data',
      type: ResendEmailVerificationDto,
    },
    consumes: 'application/json',
    conflictResponse: {
      description: 'Email is already verified',
    },
    createdResponse: {
      description: 'OTP sent successfully',
      example: { message: 'OTP sent successfully' },
    },
  })
  @Post('/resend/email')
  async resendEmailVerification(
    @Body(ValidationPipe)
    resendEmailVerificationDto: ResendEmailVerificationDto,
  ): Promise<{ message: string }> {
    return this.userService.resendEmailVerification(resendEmailVerificationDto);
  }

  @ApiDocumentation({
    operation: {
      summary: 'Verify user phone',
      description: 'Verify user phone by OTP',
    },
    security: 'bearer',
    body: {
      description: 'User phone verification data',
      type: VerifyUserPhoneDto,
    },
    consumes: 'application/json',
    conflictResponse: {
      description: 'Phone is already verified/Invalid OTP',
    },
    okResponse: {
      description: 'User phone verified successfully',
      type: UserReturnDto,
    },
  })
  @UseGuards(JwtGuard)
  @Patch('verify/phone')
  async verifyUserPhone(
    @Body(ValidationPipe) verifyUserPhoneDto: VerifyUserPhoneDto,
    @Req() request: Request,
  ): Promise<UserReturnDto> {
    const user = request.user;

    if (
      !user.phoneNumber ||
      user.phoneNumber !== verifyUserPhoneDto.phoneNumber
    ) {
      throw new UnauthorizedException();
    }

    return this.userService.verifyPhone(verifyUserPhoneDto);
  }

  @ApiDocumentation({
    operation: {
      summary: 'Resend phone verification',
      description: 'Resend phone verification OTP',
    },
    security: 'bearer',
    body: {
      description: 'Resend phone verification data',
      type: ResendPhoneVerificationDto,
    },
    consumes: 'application/json',
    conflictResponse: {
      description: 'Phone is already verified',
    },
    createdResponse: {
      description: 'OTP sent successfully',
      example: { message: 'OTP sent successfully' },
    },
  })
  @UseGuards(JwtGuard)
  @Post('/resend/phone')
  async resendPhoneVerification(
    @Body(ValidationPipe)
    resendPhoneVerificationDto: ResendPhoneVerificationDto,
  ) {
    return this.userService.resendPhoneVerification(resendPhoneVerificationDto);
  }
}
