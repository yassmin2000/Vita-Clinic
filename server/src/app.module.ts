import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma.service';
import { UsersService } from './users/users.service';
import { DevicesModule } from './devices/devices.module';
import { DevicesService } from './devices/devices.service';
import { UsersModule } from './users/users.module';
import { UsersController } from './users/users.controller';
import { JwtModule } from '@nestjs/jwt';
import { SettingsModule } from './settings/settings.module';
import { OtpModule } from './otp/otp.module';
import { OtpService } from './otp/otp.service';

@Module({
  imports: [
    JwtModule.register({}),
    ConfigModule.forRoot(),
    AuthModule,
    DevicesModule,
    UsersModule,
    SettingsModule,
    OtpModule,
  ],
  controllers: [AppController, UsersController],
  providers: [
    AppService,
    PrismaService,
    UsersService,
    DevicesService,
    OtpService,
  ],
})
export class AppModule {}
