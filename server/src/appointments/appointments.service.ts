import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';
import { LaboratoryTestsService } from 'src/settings/laboratory-tests/laboratory-tests.service';
import { ModalitiesService } from 'src/settings/modalities/modalities.service';
import { ServicesService } from 'src/settings/services/services.service';
import { TherapiesService } from 'src/settings/therapies/therapies.service';

import {
  CreateAppointmentDto,
  GetAllAppointmentsQuery,
} from './dto/appointments.dto';
import type { AppointmentStatus } from '@prisma/client';

@Injectable()
export class AppointmentsService {
  constructor(
    private prisma: PrismaService,
    private laboratoryTestsService: LaboratoryTestsService,
    private modalitiesService: ModalitiesService,
    private servicesService: ServicesService,
    private therapiesService: TherapiesService,
  ) {}

  async findAll({
    page = 1,
    limit = 10,
    status = 'all',
    value = '',
    sort = 'date-desc',
  }: GetAllAppointmentsQuery) {
    const names = value.trim().split(' ');
    const mode = 'insensitive' as 'insensitive';
    const [sortField, sortOrder] = sort.split('-') as [string, 'desc' | 'asc'];

    const nameConditions = names.flatMap((name) => [
      {
        doctor: {
          OR: [
            {
              firstName: {
                contains: name,
                mode,
              },
            },
            {
              lastName: {
                contains: name,
                mode,
              },
            },
          ],
        },
      },
      {
        patient: {
          OR: [
            {
              firstName: {
                contains: name,
                mode,
              },
            },
            {
              lastName: {
                contains: name,
                mode,
              },
            },
          ],
        },
      },
    ]);

    return this.prisma.appointment.findMany({
      where: {
        status: status === 'all' ? undefined : status,
        OR: nameConditions,
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        doctor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: [
        ...(sortField === 'doctorName'
          ? [{ doctor: { firstName: sortOrder } }]
          : []),
        ...(sortField === 'patientName'
          ? [{ patient: { firstName: sortOrder } }]
          : []),
        {
          date: sortField === 'date' ? sortOrder : undefined,
          createdAt: sortField === 'bookingDate' ? sortOrder : undefined,
        },
      ],
    });
  }

  async findById(id: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: {
        vitals: true,
        reports: true,
        scans: true,
        laboratoryTestResults: true,
        services: {
          include: {
            service: true,
            therapy: true,
            scans: true,
            labWorks: true,
          },
        },
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        doctor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    return appointment;
  }

  async create(patientId: string, createAppointmentDto: CreateAppointmentDto) {
    const { date, notes, service, therapy, scans, labWorks } =
      createAppointmentDto;

    if (date < new Date().toISOString()) {
      throw new UnprocessableEntityException('Invalid date');
    }

    const emr = await this.prisma.electronicMedicalRecord.findFirst({
      where: {
        patientId,
      },
    });

    if (!emr) {
      throw new NotFoundException('Electronic medical record not found');
    }

    let servicePrice = 0;
    if (service) {
      const serviceData = await this.servicesService.findById(service);
      servicePrice = serviceData.price;
    }

    let therapyPrice = 0;
    if (therapy) {
      const therapyData = await this.therapiesService.findById(therapy);
      therapyPrice = therapyData.price;
    }

    const scanPrices = await Promise.all(
      scans.map(async (scan) => {
        const scanData = await this.modalitiesService.findById(scan);
        return scanData.price;
      }),
    );

    const labWorkPrices = await Promise.all(
      labWorks.map(async (labWork) => {
        const labWorkData = await this.laboratoryTestsService.findById(labWork);
        return labWorkData.price;
      }),
    );

    const price = [
      servicePrice,
      therapyPrice,
      ...scanPrices,
      ...labWorkPrices,
    ].reduce((total, value) => total + value, 0);

    const appointmentServices = await this.prisma.appointmentServices.create({
      data: {
        notes,
        serviceId: service,
        therapyId: therapy,
        scans: {
          connect: scans.map((id) => ({ id })),
        },
        labWorks: {
          connect: labWorks.map((id) => ({ id })),
        },
      },
    });

    const billing = await this.prisma.billing.create({
      data: {
        date,
        status: 'initial',
        amount: price > 0 ? price : 20,
      },
    });

    return this.prisma.appointment.create({
      data: {
        date,
        status: 'pending',
        patientId,
        electronicMedicalRecordId: emr.id,
        appointmentServicesId: appointmentServices.id,
        billingId: billing.id,
      },
      include: {
        services: {
          include: {
            service: true,
            therapy: true,
            scans: true,
            labWorks: true,
          },
        },
      },
    });
  }

  async changeStatus(appointmentId: string, status: AppointmentStatus) {
    if (status === 'pending') {
      throw new ConflictException('Status cannot be changed');
    }

    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    const unchangeableStatuses = ['completed', 'rejected', 'cancelled'];

    if (
      unchangeableStatuses.includes(appointment.status) ||
      (appointment.status === 'pending' &&
        (status === 'completed' || status === 'cancelled')) ||
      (appointment.status === 'approved' && status === 'rejected')
    ) {
      throw new ConflictException('Status cannot be changed');
    }

    return this.prisma.appointment.update({
      where: { id: appointmentId },
      data: { status },
    });
  }
}
