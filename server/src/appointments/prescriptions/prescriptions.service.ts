import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import {
  CreatePrescriptionDto,
  UpdatePrescriptionDto,
  GetPatientPrescriptionsQuery,
} from './dto/prescriptions.dto';

@Injectable()
export class PrescriptionsService {
    constructor(private readonly prisma: PrismaService) {}
    async findAllByAppointmentId(appointmentId: string) {
        return this.prisma.prescription.findMany({
          where: { appointmentId },
          include: {
            medication: true,
            appointment: true,
          },
        });
      }
    
      async findAllByPatientId(
        patientId: string,
        {
          page = 1,
          limit = 10,
          sort = 'createdAt-desc',
        }: GetPatientPrescriptionsQuery,
      ) {
        const [sortField, sortOrder] = sort.split('-') as [string, 'desc' | 'asc'];
    
        return this.prisma.prescription.findMany({
          where: {
            appointment: { patientId },
          },
          include: {
            medication: true,
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
    
      async create(createPrescriptionDto: CreatePrescriptionDto) {
        const appointment = await this.prisma.appointment.findUnique({
          where: { id: createPrescriptionDto.appointmentId },
        });
    
        if (!appointment) {
          throw new NotFoundException('Appointment not found');
        }
    
        const medication = await this.prisma.medication.findUnique({
          where: { id: createPrescriptionDto.medicationId },
        });
    
        if (!medication) {
          throw new NotFoundException('Medication not found');
        }
    
        return this.prisma.prescription.create({
          data: createPrescriptionDto,
        });
      }
    
      async update(id: string, updatePrescriptionDto: UpdatePrescriptionDto) {
        const existingPrescription = await this.prisma.prescription.findUnique({
          where: { id },
        });
    
        if (!existingPrescription) {
          throw new NotFoundException('Prescription not found');
        }
    
        const { medicationId, appointmentId, ...dto } = updatePrescriptionDto;
    
        return this.prisma.prescription.update({
          where: { id },
          data: dto,
        });
      }
}
