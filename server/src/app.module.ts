import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma.service';
import { UsersService } from './users/users.service';
import { DevicesModule } from './devices/devices.module';
import { DevicesService } from './devices/devices.service';
import { SettingsModule } from './settings/settings.module';
import { UsersModule } from './users/users.module';
import { UsersController } from './users/users.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({}),
    ConfigModule.forRoot(),
    AuthModule,
    SettingsModule,
    DevicesModule,
    UsersModule,
  ],
  controllers: [AppController, UsersController],
  providers: [AppService, PrismaService, UsersService, DevicesService],
})
export class AppModule {}
