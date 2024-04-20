import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';
import { EmrDto } from './dto/emr.dto';

@Injectable()
export class EmrService {
  constructor(private prisma: PrismaService) {}

  async create(patientId: string, emrDto: EmrDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: patientId },
      include: {
        emr: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role !== 'patient') {
      throw new ConflictException('User is not a patient');
    }

    if (user.emr) {
      throw new ConflictException('EMR already exists');
    }

    return await this.prisma.electronicMedicalRecord.create({
      data: {
        patientId,
        ...emrDto,
      },
    });
  }
}
