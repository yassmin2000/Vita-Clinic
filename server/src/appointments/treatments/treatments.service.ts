import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import {
  CreateTreatmentDto,
  UpdateTreatmentDto,
  GetPatientTreatmentsQuery,
} from './dto/treatments.dto';

@Injectable()
export class TreatmentService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllByAppointmentId(appointmentId: string) {
    return this.prisma.treatment.findMany({
      where: { appointmentId },
      include: {
        therapy: true,
        appointment: true,
      },
    });
  }

  async findAllByPatientId(
    patientId: string,
    {
      page = 1,
      limit = 10,
      value = '',
      sort = 'createdAt-desc',
    }: GetPatientTreatmentsQuery,
  ) {
    const [sortField, sortOrder] = sort.split('-') as [string, 'desc' | 'asc'];

    return this.prisma.treatment.findMany({
      where: {
        appointment: { patientId },
        name: { contains: value, mode: 'insensitive' },
      },
      include: {
        therapy: true,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: [
        {
          name: sortField === 'name' ? sortOrder : undefined,
        },
        {
          createdAt: sortField === 'createdAt' ? sortOrder : undefined,
        },
      ],
    });
  }

  async create(createTreatmentDto: CreateTreatmentDto) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: createTreatmentDto.appointmentId },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    const therapy = await this.prisma.therapy.findUnique({
      where: { id: createTreatmentDto.therapyId },
    });

    if (!therapy) {
      throw new NotFoundException('Therapy not found');
    }

    return this.prisma.treatment.create({
      data: createTreatmentDto,
    });
  }

  async update(id: string, updateTreatmentDto: UpdateTreatmentDto) {
    const existingTreatment = await this.prisma.treatment.findUnique({
      where: { id },
    });

    if (!existingTreatment) {
      throw new NotFoundException('Treatment not found');
    }

    const { therapyId, appointmentId, ...dto } = updateTreatmentDto;

    return this.prisma.treatment.update({
      where: { id },
      data: dto,
    });
  }
}
