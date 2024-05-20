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
import { LogService } from 'src/log/log.service';

import {
  CreateAppointmentDto,
  GetAllAppointmentsQuery,
} from './dto/appointments.dto';
import type { BillingStatus } from '@prisma/client';

@Injectable()
export class AppointmentsService {
  constructor(
    private prisma: PrismaService,
    private laboratoryTestsService: LaboratoryTestsService,
    private modalitiesService: ModalitiesService,
    private servicesService: ServicesService,
    private therapiesService: TherapiesService,
    private logService: LogService,
  ) {}

  async findAll(
    {
      page = 1,
      limit = 10,
      doctor = false,
      status = 'all',
      value = '',
      sort = 'date-desc',
    }: GetAllAppointmentsQuery,
    patientId?: string,
    doctorId?: string,
  ) {
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
        patientId: patientId || undefined,
        doctorId: doctor && doctorId ? doctorId : undefined,
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
        emr: {
          select: {
            insurance: true,
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
        billing: true,
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
        emr: {
          select: {
            insurance: true,
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

    const vitals = await this.prisma.vitals.create({
      data: {},
    });

    return this.prisma.appointment.create({
      data: {
        date,
        status: 'pending',
        patientId,
        emrId: emr.id,
        appointmentServicesId: appointmentServices.id,
        billingId: billing.id,
        vitalsId: vitals.id,
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
        billing: true,
      },
    });
  }

  async approve(appointmentId: string, doctorId: string, userId: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    const doctor = await this.prisma.user.findUnique({
      where: { id: doctorId, role: 'doctor' },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    if (appointment.status !== 'pending') {
      throw new ConflictException('Appointment is not pending');
    }

    const approvedAppointment = this.prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        status: 'approved',
        doctorId,
      },
    });

    await this.logService.create({
      userId,
      targetId: appointment.id,
      targetName: `Appointment ${appointment.number}`,
      type: 'appointment',
      action: 'approve',
      targetUserId: appointment.patientId,
    });

    return approvedAppointment;
  }

  async reject(appointmentId: string, userId: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    if (appointment.status !== 'pending') {
      throw new ConflictException('Appointment is not pending');
    }

    const rejectedAppointment = await this.prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        status: 'rejected',
      },
    });

    await this.logService.create({
      userId,
      targetId: rejectedAppointment.id,
      targetName: `Appointment ${rejectedAppointment.number}`,
      type: 'appointment',
      action: 'reject',
      targetUserId: rejectedAppointment.patientId,
    });

    return rejectedAppointment;
  }

  async cancel(appointmentId: string, userId: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    if (appointment.status !== 'approved') {
      throw new ConflictException('Appointment is not approved');
    }

    await this.prisma.billing.update({
      where: {
        id: appointment.billingId,
      },
      data: {
        status: 'cancelled',
      },
    });

    const cancelledAppointment = await this.prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        status: 'cancelled',
      },
    });

    await this.logService.create({
      userId,
      targetId: cancelledAppointment.id,
      targetName: `Appointment ${cancelledAppointment.number}`,
      type: 'appointment',
      action: 'cancel',
      targetUserId: cancelledAppointment.patientId,
    });

    return cancelledAppointment;
  }

  async complete(
    appointmentId: string,
    billingStatus: BillingStatus,
    userId: string,
  ) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
      select: {
        billingId: true,
        status: true,
        emr: {
          select: {
            insurance: true,
          },
        },
      },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    if (appointment.status !== 'approved') {
      throw new ConflictException('Appointment is not approved');
    }

    if (billingStatus === 'insurance' && !appointment.emr.insurance) {
      throw new ConflictException('Patient does not have insurance');
    }

    if (
      billingStatus === 'insurance' &&
      appointment.emr.insurance &&
      new Date(appointment.emr.insurance.policyEndDate) < new Date()
    ) {
      throw new ConflictException('Insurance policy has expired');
    }

    await this.prisma.billing.update({
      where: { id: appointment.billingId },
      data: {
        status: billingStatus,
      },
    });

    const completedAppointment = await this.prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        status: 'completed',
      },
    });

    await this.logService.create({
      userId,
      targetId: completedAppointment.id,
      targetName: `Appointment ${completedAppointment.number}`,
      type: 'appointment',
      action: 'complete',
      targetUserId: completedAppointment.patientId,
    });

    return completedAppointment;
  }
}
