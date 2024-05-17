import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import {
  CreateLaboratoryTestResultDto,
  GetPatientTestResultsQuery,
  UpdateLaboratoryTestResultDto,
} from './dto/test-results.dto';

@Injectable()
export class TestResultsService {
  constructor(private readonly prisma: PrismaService) {}
  async findAllByAppointmentId(appointmentId: string) {
    return await this.prisma.laboratoryTestResult.findMany({
      where: { appointmentId },
      include: {
        appointment: true,
        laboratoryTest: {
          include: {
            biomarkers: true,
          },
        },
        values: {
          include: {
            biomarker: true,
          },
        },
      },
    });
  }

  async findAllByPatientId(
    patientId: string,
    {
      page = 1,
      limit = 10,
      sort = 'createdAt-desc',
    }: GetPatientTestResultsQuery,
  ) {
    const [sortField, sortOrder] = sort.split('-') as [string, 'desc' | 'asc'];

    return this.prisma.laboratoryTestResult.findMany({
      where: {
        appointment: { patientId },
      },
      include: {
        laboratoryTest: {
          include: {
            biomarkers: true,
          },
        },
        values: {
          include: {
            biomarker: true,
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: [
        {
          createdAt: sortField === 'createdAt' ? sortOrder : undefined,
        },
      ],
    });
  }

  async create(createLaboratoryTestResultDto: CreateLaboratoryTestResultDto) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: createLaboratoryTestResultDto.appointmentId },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    const laboratoryTest = await this.prisma.laboratoryTest.findUnique({
      where: { id: createLaboratoryTestResultDto.laboratoryTestId },
      include: {
        biomarkers: true,
      },
    });

    if (!laboratoryTest) {
      throw new NotFoundException('Laboratory test not found');
    }

    const { values, ...data } = createLaboratoryTestResultDto;

    await Promise.all(
      values.map(async (value) => {
        if (
          !laboratoryTest.biomarkers.find(
            (biomarker) => biomarker.id === value.biomarkerId,
          )
        ) {
          throw new NotFoundException('Biomarker not found');
        }
      }),
    );

    return this.prisma.laboratoryTestResult.create({
      data: {
        ...data,
        values: {
          createMany: {
            data: createLaboratoryTestResultDto.values.map((value) => ({
              biomarkerId: value.biomarkerId,
              value: value.value,
            })),
          },
        },
      },
    });
  }

  async update(
    id: string,
    updateLaboratoryTestResultDto: UpdateLaboratoryTestResultDto,
  ) {
    const existingLaboratoryTestResult =
      await this.prisma.laboratoryTestResult.findUnique({
        where: { id },
        include: {
          values: true,
        },
      });

    if (!existingLaboratoryTestResult) {
      throw new NotFoundException('Laboratory test result not found');
    }

    const { appointmentId, laboratoryTestId, values, ...data } =
      updateLaboratoryTestResultDto;

    await Promise.all(
      existingLaboratoryTestResult.values.map(async (value) => {
        const currentValue = values.find(
          (v) => v.biomarkerId === value.biomarkerId,
        );
        if (currentValue && currentValue.value !== value.value) {
          await this.prisma.biomarkerValue.update({
            where: {
              id: value.id,
            },
            data: {
              value: currentValue.value,
            },
          });
        }
      }),
    );

    return this.prisma.laboratoryTestResult.update({
      where: { id },
      data,
    });
  }
}
