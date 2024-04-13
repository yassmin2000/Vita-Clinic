import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { AuthModule } from './auth/auth.module';
import { DevicesModule } from './devices/devices.module';
import { OtpModule } from './otp/otp.module';
import { SettingsModule } from './settings/settings.module';
import { UsersModule } from './users/users.module';

import { AppController } from './app.controller';
import { UsersController } from './users/users.controller';

import { AppService } from './app.service';
import { DevicesService } from './devices/devices.service';
import { OtpService } from './otp/otp.service';
import { PrismaService } from './prisma.service';
import { UsersService } from './users/users.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({}),
    AuthModule,
    DevicesModule,
    OtpModule,
    SettingsModule,
    UsersModule,
  ],
  controllers: [AppController, UsersController],
  providers: [
    AppService,
    DevicesService,
    OtpService,
    PrismaService,
    UsersService,
  ],
})
export class AppModule {}
