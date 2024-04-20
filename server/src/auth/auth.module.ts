import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AuthController } from './auth.controller';

import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/users/users.service';
import { OtpService } from 'src/otp/otp.service';
import { EmrService } from 'src/emr/emr.service';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtService,
    PrismaService,
    UsersService,
    OtpService,
    EmrService,
  ],
})
export class AuthModule {}
