import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';

@Injectable()
export class DoctorsService {
  constructor(private prisma: PrismaService) {}

  async updateSpeciality(id: string, specialityId: string) {
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

    return this.prisma.user.update({
      where: { id },
      data: {
        specialityId,
      },
    });
  }
}
