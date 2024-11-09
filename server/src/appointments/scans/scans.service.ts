import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';
import { LogService } from 'src/log/log.service';

import { processDicomFiles } from './utils';

import {
  BasicScanDto,
  CreateScanDto,
  FullScanDto,
  GetPatientScansQuery,
  ScanDto,
  UpdateScanDto,
} from './dto/scans.dto';

@Injectable()
export class ScansService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logService: LogService,
  ) {}

  async findAllByPatientId(
    patientId: string,
    {
      page = 1,
      limit = 10,
      value = '',
      sort = 'createdAt-desc',
    }: GetPatientScansQuery,
  ): Promise<ScanDto[]> {
    const [sortField, sortOrder] = sort.split('-') as [string, 'desc' | 'asc'];

    return this.prisma.scan.findMany({
      where: {
        appointment: { patientId },
        title: { contains: value, mode: 'insensitive' },
      },
      select: {
        id: true,
        title: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
        modality: true,
        modalityId: true,
        appointment: true,
        appointmentId: true,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: [
        {
          title: sortField === 'name' ? sortOrder : undefined,
        },
        {
          createdAt: sortField === 'createdAt' ? sortOrder : undefined,
        },
      ],
    });
  }

  async findAllByAppointmentId(appointmentId: string): Promise<ScanDto[]> {
    return this.prisma.scan.findMany({
      where: { appointmentId },
      select: {
        id: true,
        title: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
        modality: true,
        modalityId: true,
        appointment: true,
        appointmentId: true,
      },
    });
  }

  async findById(id: string): Promise<FullScanDto> {
    const scan = await this.prisma.scan.findUnique({
      where: { id },
      include: {
        appointment: true,
        modality: true,
        study: {
          include: {
            series: {
              include: {
                instances: true,
              },
            },
          },
        },
      },
    });

    if (!scan) {
      throw new NotFoundException('Scan not found');
    }

    return scan;
  }

  async create(
    createScanDto: CreateScanDto,
    userId: string,
  ): Promise<BasicScanDto> {
    const { title, notes, modalityId, scanURLs, appointmentId } = createScanDto;

    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    const modality = await this.prisma.modality.findUnique({
      where: { id: modalityId },
    });

    if (!appointment || !modality) {
      throw new NotFoundException('Appointment not found');
    }

    const sutdies = await processDicomFiles(scanURLs);

    if (sutdies.length === 0) {
      throw new UnprocessableEntityException('No valid DICOM files found');
    }

    if (sutdies.length > 1) {
      throw new UnprocessableEntityException(
        "Can't create multiple studies at once",
      );
    }

    const [studyData] = sutdies;

    const uniqueModalities = Array.from(
      new Set(
        studyData.series.filter((s) => s.modality).map((s) => s.modality),
      ),
    );

    return await this.prisma.$transaction(async (prisma) => {
      const scan = await prisma.scan.create({
        data: {
          title,
          notes,
          modality: { connect: { id: modalityId } },
          appointment: { connect: { id: appointmentId } },
          study: {
            create: {
              description: studyData.description.replace(/\0/g, ''),
              studyInstanceUID: studyData.studyInstanceUID.replace(/\0/g, ''),
              modalities: uniqueModalities,
            },
          },
        },
        include: {
          study: true,
        },
      });

      const studyId = scan.study.id;

      for (const series of studyData.series) {
        const createdSeries = await prisma.series.create({
          data: {
            seriesInstanceUID: series.seriesInstanceUID.replace(/\0/g, ''),
            seriesNumber: series.seriesNumber,
            description: series.description.replace(/\0/g, ''),
            modality: series.modality,
            studyId: studyId,
          },
        });

        await prisma.instance.createMany({
          data: series.instances.map((instance) => ({
            sopInstanceUID: instance.instanceUID.replace(/\0/g, ''),
            instanceNumber: instance.instanceNumber,
            url: instance.url,
            seriesId: createdSeries.id,
          })),
        });
      }

      await this.logService.create({
        userId,
        targetId: scan.id,
        targetName: scan.title,
        type: 'scan',
        action: 'create',
        targetUserId: appointment.patientId,
      });

      return scan;
    });
  }

  async update(
    id: string,
    updateScanDto: UpdateScanDto,
    userId: string,
  ): Promise<BasicScanDto> {
    const { title, notes } = updateScanDto;

    const existingScan = await this.prisma.scan.findUnique({
      where: { id },
    });

    if (!existingScan) {
      throw new NotFoundException('Scan not found');
    }

    const scan = await this.prisma.scan.update({
      where: { id },
      data: {
        title,
        notes,
      },
      include: {
        appointment: {
          select: {
            patientId: true,
          },
        },
      },
    });

    await this.logService.create({
      userId,
      targetId: scan.id,
      targetName: scan.title,
      type: 'scan',
      action: 'update',
      targetUserId: scan.appointment.patientId,
    });

    return scan;
  }
}
