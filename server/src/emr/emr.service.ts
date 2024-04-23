import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';
import { AllergiesService } from 'src/settings/allergies/allergies.service';
import { DiagnosesService } from 'src/settings/diagnoses/diagnoses.service';

import {
  EmrDto,
  PatientAllergiesDto,
  PatientDiagnosesDto,
} from './dto/emr.dto';
import type { PatientAllergy, PatientDiagnosis } from '@prisma/client';

@Injectable()
export class EmrService {
  constructor(
    private prisma: PrismaService,
    private allergiesService: AllergiesService,
    private diagnosesService: DiagnosesService,
  ) {}

  async getById(patientId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: patientId, role: 'patient' },
      include: {
        emr: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.emr) {
      throw new NotFoundException('EMR not found');
    }

    return this.prisma.electronicMedicalRecord.findUnique({
      where: { patientId },
      include: {
        allergies: {
          include: {
            allergy: {
              select: {
                name: true,
              },
            },
          },
        },
        diagnoses: {
          include: {
            diagnosis: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
  }

  async create(patientId: string, emrDto: EmrDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: patientId },
      include: {
        emr: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role !== 'patient') {
      throw new ConflictException('User is not a patient');
    }

    if (user.emr) {
      throw new ConflictException('EMR already exists');
    }

    const {
      height,
      weight,
      bloodType,
      smokingStatus,
      alcoholStatus,
      drugsUsage,
    } = emrDto;

    return await this.prisma.electronicMedicalRecord.create({
      data: {
        patientId,
        height,
        weight,
        bloodType,
        smokingStatus,
        alcoholStatus,
        drugsUsage,
      },
    });
  }

  async update(patientId: string, emrDto: EmrDto) {
    const patient = await this.prisma.user.findUnique({
      where: {
        id: patientId,
        role: 'patient',
      },
    });

    if (!patient) {
      return new NotFoundException('Patient not found');
    }

    const emr = await this.prisma.electronicMedicalRecord.findUnique({
      where: { patientId: patientId },
      select: {
        id: true,
        allergies: true,
        diagnoses: true,
      },
    });

    const {
      height,
      weight,
      bloodType,
      smokingStatus,
      alcoholStatus,
      drugsUsage,
      allergies,
      diagnoses,
    } = emrDto;

    if (!emr) {
      const newEmr = await this.create(patientId, {
        height,
        weight,
        bloodType,
        smokingStatus,
        alcoholStatus,
        drugsUsage,
      });

      if (allergies) {
        await this.updateAllergies(newEmr.id, [], allergies);
      }

      if (diagnoses) {
        await this.updateDiagnoses(newEmr.id, [], diagnoses);
      }

      return newEmr;
    }

    await this.prisma.electronicMedicalRecord.update({
      where: {
        id: emr.id,
      },
      data: {
        height,
        weight,
        bloodType,
        smokingStatus,
        alcoholStatus,
        drugsUsage,
      },
    });

    if (allergies) {
      await this.updateAllergies(emr.id, emr.allergies, allergies);
    }

    if (diagnoses) {
      await this.updateDiagnoses(emr.id, emr.diagnoses, diagnoses);
    }

    return emr;
  }

  async updateAllergies(
    emrId: string,
    patientAllergies: PatientAllergy[],
    allergies: PatientAllergiesDto,
  ): Promise<boolean> {
    try {
      // Create new allergies
      await Promise.all(
        allergies.new.map(async (allergy) => {
          if (
            patientAllergies.find(
              (patientAllergy) =>
                patientAllergy.allergyId === allergy.allergyId,
            )
          ) {
            return;
          }

          const currentAllergy = await this.allergiesService.findById(
            allergy.allergyId,
          );

          if (currentAllergy) {
            return this.prisma.patientAllergy.create({
              data: {
                emrId,
                allergyId: currentAllergy.id,
                notes: allergy.notes,
                patientReaction: allergy.reaction,
              },
            });
          }
        }),
      );

      // Update existing allergies
      await Promise.all(
        allergies.updated.map(async (allergy) => {
          const currentPatientAllergy = patientAllergies.find(
            (patientAllergy) => patientAllergy.allergyId === allergy.allergyId,
          );

          if (currentPatientAllergy) {
            return this.prisma.patientAllergy.update({
              where: {
                id: currentPatientAllergy.id,
              },
              data: {
                notes: allergy.notes,
                patientReaction: allergy.reaction,
              },
            });
          }
        }),
      );

      // Delete allergies
      await Promise.all(
        allergies.deleted.map(async (id) => {
          const currentPatientAllergy = patientAllergies.find(
            (patientAllergy) => patientAllergy.allergyId === id,
          );

          if (currentPatientAllergy) {
            return this.prisma.patientAllergy.delete({
              where: {
                id: currentPatientAllergy.id,
              },
            });
          }
        }),
      );

      return true;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to update allergies');
    }
  }

  async updateDiagnoses(
    emrId: string,
    patientDiagnoses: PatientDiagnosis[],
    diagnoses: PatientDiagnosesDto,
  ): Promise<boolean> {
    try {
      // Create new diagnoses
      await Promise.all(
        diagnoses.new.map(async (diagnosis) => {
          if (
            patientDiagnoses.find(
              (patientDiagnosis) =>
                patientDiagnosis.diagnosisId === diagnosis.diagnosisId,
            )
          ) {
            return;
          }

          const currentDiagnosis = await this.diagnosesService.findById(
            diagnosis.diagnosisId,
          );

          if (currentDiagnosis) {
            return this.prisma.patientDiagnosis.create({
              data: {
                emrId,
                diagnosisId: currentDiagnosis.id,
                notes: diagnosis.notes,
                date: diagnosis.date,
              },
            });
          }
        }),
      );

      // Update existing diagnoses
      await Promise.all(
        diagnoses.updated.map(async (diagnosis) => {
          const currentPatientDiagnosis = patientDiagnoses.find(
            (patientDiagnosis) =>
              patientDiagnosis.diagnosisId === diagnosis.diagnosisId,
          );

          if (currentPatientDiagnosis) {
            return this.prisma.patientDiagnosis.update({
              where: {
                id: currentPatientDiagnosis.id,
              },
              data: {
                notes: diagnosis.notes,
                date: diagnosis.date,
              },
            });
          }
        }),
      );

      // Delete diagnoses
      await Promise.all(
        diagnoses.deleted.map(async (id) => {
          const currentPatientDiagnosis = patientDiagnoses.find(
            (patientDiagnosis) => patientDiagnosis.diagnosisId === id,
          );

          if (currentPatientDiagnosis) {
            return this.prisma.patientDiagnosis.delete({
              where: {
                id: currentPatientDiagnosis.id,
              },
            });
          }
        }),
      );

      return true;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to update diagnoses');
    }
  }
}
