import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';

import { AppointmentsModule } from './appointments/appointments.module';
import { AuthModule } from './auth/auth.module';
import { DevicesModule } from './devices/devices.module';
import { EmrModule } from './emr/emr.module';
import { SettingsModule } from './settings/settings.module';
import { UsersModule } from './users/users.module';
import { LogModule } from './log/log.module';
import { DashboardsModule } from './dashboards/dashboards.module';
import { EmailOtpModule } from './email-otp/email-otp.module';
import { PhoneOtpModule } from './phone-otp/phone-otp.module';
import { PacsModule } from './pacs/pacs.module';
import { NotificationsModule } from './notifications/notifications.module';

import { AppController } from './app.controller';

import { AppService } from './app.service';
import { TasksService } from './tasks.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({}),
    ScheduleModule.forRoot(),
    AppointmentsModule,
    AuthModule,
    DevicesModule,
    SettingsModule,
    UsersModule,
    EmrModule,
    EmailOtpModule,
    PhoneOtpModule,
    LogModule,
    DashboardsModule,
    PacsModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService, TasksService],
})
export class AppModule {}
