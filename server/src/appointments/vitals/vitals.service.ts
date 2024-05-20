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

  async getLatestByPatientId(patientId: string) {
    const allVitals = await this.prisma.vitals.findMany({
      where: {
        appointment: {
          patientId,
        },
      },
      orderBy: {
        appointment: {
          date: 'desc',
        },
      },
    });

    const latestData = allVitals[0];
    const data = {
      temperature: 0,
      systolicBloodPressure: 0,
      diastolicBloodPressure: 0,
      heartRate: 0,
      respiratoryRate: 0,
      oxygenSaturation: 0,
    };

    for (const key in latestData) {
      let i = 0;
      let value = latestData[key];
      while (value === null && i < allVitals.length) {
        value = allVitals[i][key];
        i++;
      }
      data[key] = value;
    }

    return data;
  }

  async getVitalsData(patientId: string) {
    const vitals = await this.prisma.vitals.findMany({
      where: {
        appointment: {
          patientId,
        },
      },
      include: {
        appointment: true,
      },
      orderBy: {
        appointment: {
          date: 'desc',
        },
      },
    });

    const processedData = [
      {
        id: 'Temperature',
        data: vitals
          .filter((v) => v.temperature !== null)
          .map((v) => ({
            x: v.appointment.date.toISOString().split('T')[0],
            y: v.temperature,
          })),
      },
      {
        id: 'Heart Rate',
        data: vitals
          .filter((v) => v.heartRate !== null)
          .map((v) => ({
            x: v.appointment.date.toISOString().split('T')[0],
            y: v.heartRate,
          })),
      },
      {
        id: 'Oxygen Saturation',
        data: vitals
          .filter((v) => v.oxygenSaturation !== null)
          .map((v) => ({
            x: v.appointment.date.toISOString().split('T')[0],
            y: v.oxygenSaturation,
          })),
      },
      {
        id: 'Respiratory Rate',
        data: vitals
          .filter((v) => v.respiratoryRate !== null)
          .map((v) => ({
            x: v.appointment.date.toISOString().split('T')[0],
            y: v.respiratoryRate,
          })),
      },
      {
        id: 'Systolic Blood Pressure',
        data: vitals
          .filter((v) => v.systolicBloodPressure != null)
          .map((v) => ({
            x: v.appointment.date.toISOString().split('T')[0],
            y: v.systolicBloodPressure,
          })),
      },
      {
        id: 'Diastolic Blood Pressure',
        data: vitals
          .filter((v) => v.diastolicBloodPressure != null)
          .map((v) => ({
            x: v.appointment.date.toISOString().split('T')[0],
            y: v.diastolicBloodPressure,
          })),
      },
    ];

    return processedData;
  }
}
