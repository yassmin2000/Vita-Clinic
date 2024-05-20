import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';
import { LogService } from 'src/log/log.service';

import { InsuranceDto, UpdateInsuranceDto } from '../dto/users.dto';

@Injectable()
export class PatientsService {
  constructor(
    private prisma: PrismaService,
    private logService: LogService,
  ) {}

  async getInsurance(id: string) {
    const patient = await this.prisma.user.findUnique({
      where: {
        id,
        role: 'patient',
      },
      select: {
        id: true,
        emr: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!patient || !patient.emr.id) {
      throw new NotFoundException('Patient not found');
    }

    const insurance = await this.prisma.insurance.findUnique({
      where: {
        emrId: patient.emr.id,
      },
    });

    if (!insurance) {
      throw new NotFoundException('This patient does not have insurance');
    }

    return insurance;
  }

  async craeteInsurance(
    id: string,
    insuranceDto: InsuranceDto,
    userId: string,
  ) {
    const patient = await this.prisma.user.findUnique({
      where: {
        id,
        role: 'patient',
      },
      select: {
        id: true,
        emr: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!patient || !patient.emr.id) {
      throw new NotFoundException('Patient not found');
    }

    const existingInsurance = await this.prisma.insurance.findUnique({
      where: {
        emrId: patient.emr.id,
      },
    });

    if (existingInsurance) {
      throw new ConflictException('This patient already has insurance');
    }

    const insurance = await this.prisma.insurance.create({
      data: {
        ...insuranceDto,
        emrId: patient.emr.id,
      },
    });

    await this.logService.create({
      userId,
      targetId: insurance.id,
      targetName: `${insurance.provider} Insurance`,
      type: 'insurance',
      action: 'create',
      targetUserId: id,
    });
  }

  async updateInsurance(
    id: string,
    updateInsuranceDto: UpdateInsuranceDto,
    userId: string,
  ) {
    const patient = await this.prisma.user.findUnique({
      where: {
        id,
        role: 'patient',
      },
      select: {
        id: true,
        emr: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!patient || !patient.emr.id) {
      throw new NotFoundException('Patient not found');
    }

    const insurance = await this.prisma.insurance.findUnique({
      where: {
        emrId: patient.emr.id,
      },
    });

    if (!insurance) {
      throw new NotFoundException('This patient does not have insurance');
    }

    const updatedInsurance = await this.prisma.insurance.update({
      where: {
        id: insurance.id,
      },
      data: updateInsuranceDto,
    });

    await this.logService.create({
      userId,
      targetId: updatedInsurance.id,
      targetName: `${updatedInsurance.provider} Insurance`,
      type: 'insurance',
      action: 'update',
      targetUserId: id,
    });

    return updatedInsurance;
  }

  async deleteInsurance(id: string, userId: string) {
    const patient = await this.prisma.user.findUnique({
      where: {
        id,
        role: 'patient',
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        emr: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!patient || !patient.emr.id) {
      throw new NotFoundException('Patient not found');
    }

    const insurance = await this.prisma.insurance.findUnique({
      where: {
        emrId: patient.emr.id,
      },
    });

    if (!insurance) {
      throw new NotFoundException('This patient does not have insurance');
    }

    this.prisma.insurance.delete({
      where: {
        id: insurance.id,
      },
    });

    await this.logService.create({
      userId,
      targetId: patient.id,
      targetName: `${patient.firstName} ${patient.lastName}`,
      type: 'insurance',
      action: 'delete',
    });

    return insurance;
  }
}
