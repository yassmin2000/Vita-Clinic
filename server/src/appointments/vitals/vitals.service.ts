import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateVitalsDto, UpdateVitalsDto } from './dto/vitals.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class VitalsService {
  constructor(private readonly prisma: PrismaService) {}

  async update(id: string, updateVitalsDto: UpdateVitalsDto) {
    const { appointmentId, ...vitalsData } = updateVitalsDto;

    const existingVitals = await this.prisma.vitals.findUnique({
      where: { id },
    });

    if (!existingVitals) {
      throw new NotFoundException('Vitals not found');
    }

    return this.prisma.vitals.update({
      where: { id },
      data: vitalsData,
    });
  }
}
