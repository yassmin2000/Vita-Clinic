import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PatientsModule } from './patients/patients.module';
import { AdminsService } from './admins/admins.service';
import { AdminsController } from './admins/admins.controller';
import { AdminsModule } from './admins/admins.module';
import { DoctorsModule } from './doctors/doctors.module';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [UsersService, AdminsService, PrismaService, JwtService],
  controllers: [UsersController, AdminsController],
  imports: [PatientsModule, AdminsModule, DoctorsModule],
})
export class UsersModule {}
