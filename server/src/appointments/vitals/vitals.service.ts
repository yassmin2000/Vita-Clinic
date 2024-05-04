import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVitalsDto, UpdateVitalsDto } from './dto/vitals.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class VitalsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllByAppointmentId(appointmentId: string) {
    return this.prisma.vitals.findMany({
      where: {
        appointmentId,
      },
      include: {
        appointment: true,
      },
    });
  }

  async create(createVitalsDto: CreateVitalsDto) {
    const { appointmentId, ...vitalsData } = createVitalsDto;

    // Check if the appointment with the specified ID exists
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    // Create the Vitals instance and connect it to the Appointment
    return this.prisma.vitals.create({
      data: {
        ...vitalsData,
        appointment: { connect: { id: appointmentId } },
      },
    });
  }

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
