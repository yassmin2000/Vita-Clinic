import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';

import { InsuranceDto, UpdateInsuranceDto } from '../dto/users.dto';

@Injectable()
export class PatientsService {
  constructor(private prisma: PrismaService) {}

  async getInsurance(id: string) {
    const patient = await this.prisma.user.findUnique({
      where: {
        id,
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

  async craeteInsurance(id: string, insurance: InsuranceDto) {
    const patient = await this.prisma.user.findUnique({
      where: {
        id,
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

    return this.prisma.insurance.create({
      data: {
        ...insurance,
        emrId: patient.emr.id,
      },
    });
  }

  async updateInsurance(id: string, updateInsuranceDto: UpdateInsuranceDto) {
    const patient = await this.prisma.user.findUnique({
      where: {
        id,
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

    return this.prisma.insurance.update({
      where: {
        id: insurance.id,
      },
      data: updateInsuranceDto,
    });
  }

  async deleteInsurance(id: string) {
    const patient = await this.prisma.user.findUnique({
      where: {
        id,
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

    return this.prisma.insurance.delete({
      where: {
        id: insurance.id,
      },
    });
  }
}
