import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { AppointmentsModule } from './appointments/appointments.module';
import { AuthModule } from './auth/auth.module';
import { DevicesModule } from './devices/devices.module';
import { EmrModule } from './emr/emr.module';
import { SettingsModule } from './settings/settings.module';
import { UsersModule } from './users/users.module';

import { AppController } from './app.controller';

import { AppService } from './app.service';
import { EmailOtpModule } from './email-otp/email-otp.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({}),
    AppointmentsModule,
    AuthModule,
    DevicesModule,
    SettingsModule,
    UsersModule,
    EmrModule,
    EmailOtpModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
