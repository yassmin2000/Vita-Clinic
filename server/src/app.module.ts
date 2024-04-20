import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { AuthModule } from './auth/auth.module';
import { DevicesModule } from './devices/devices.module';
import { SettingsModule } from './settings/settings.module';
import { UsersModule } from './users/users.module';

import { AppController } from './app.controller';

import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({}),
    AuthModule,
    DevicesModule,
    SettingsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
