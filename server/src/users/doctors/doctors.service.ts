import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';
import { LogService } from 'src/log/log.service';

import { UserReturnDto } from '../dto/users-response.dto';

@Injectable()
export class DoctorsService {
  constructor(
    private prisma: PrismaService,
    private logService: LogService,
  ) {}

  async updateSpeciality(
    id: string,
    specialityId: string,
    userId: string,
  ): Promise<UserReturnDto> {
    const doctor = await this.prisma.user.findUnique({
      where: {
        id,
        role: 'doctor',
      },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    const speciality = await this.prisma.speciality.findUnique({
      where: {
        id: specialityId,
      },
    });

    if (!speciality) {
      throw new NotFoundException('Speciality not found');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        specialityId,
      },
    });

    await this.logService.create({
      userId,
      targetId: specialityId,
      targetName: speciality.name,
      type: 'doctor-speciality',
      action: 'update',
      targetUserId: doctor.id,
    });

    return updatedUser;
  }
}
