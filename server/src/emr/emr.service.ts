import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';
import { AllergiesService } from 'src/settings/allergies/allergies.service';
import { DiagnosesService } from 'src/settings/diagnoses/diagnoses.service';
import { MedicalConditionsService } from 'src/settings/medical-conditions/medical-conditions.service';
import { SurgeriesService } from 'src/settings/surgeries/surgeries.service';
import { MedicationsService } from 'src/settings/medications/medications.service';

import {
  EmrDto,
  PatientAllergiesDto,
  PatientDiagnosesDto,
  PatientMedicalConditionsDto,
  PatientMedicationsDto,
  PatientSurgeriesDto,
} from './dto/emr.dto';
import type {
  PatientAllergy,
  PatientDiagnosis,
  PatientMedicalCondition,
  PatientMedication,
  PatientSurgery,
} from '@prisma/client';

@Injectable()
export class EmrService {
  constructor(
    private prisma: PrismaService,
    private allergiesService: AllergiesService,
    private diagnosesService: DiagnosesService,
    private medicalConditionsService: MedicalConditionsService,
    private surgeriesService: SurgeriesService,
    private medicationsService: MedicationsService,
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
                description: true,
              },
            },
          },
        },
        diagnoses: {
          include: {
            diagnosis: {
              select: {
                name: true,
                description: true,
              },
            },
          },
        },
        medicalConditions: {
          include: {
            medicalCondition: {
              select: {
                name: true,
                description: true,
              },
            },
          },
        },
        surgeries: {
          include: {
            surgery: {
              select: {
                name: true,
                description: true,
              },
            },
          },
        },
        medications: {
          include: {
            medication: {
              select: {
                name: true,
                unit: true,
                description: true,
              },
            },
          },
        },
      },
    });
  }

  async create(patientId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: patientId, role: 'patient' },
      include: {
        emr: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.emr) {
      throw new ConflictException('EMR already exists');
    }

    return await this.prisma.electronicMedicalRecord.create({
      data: {
        patientId,
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
        medicalConditions: true,
        surgeries: true,
        medications: true,
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
      medicalConditions,
      surgeries,
      medications,
    } = emrDto;

    let emrId: string;
    if (!emr) {
      const newEmr = await this.create(patientId);
      emrId = newEmr.id;
    } else {
      emrId = emr.id;
    }

    await this.prisma.electronicMedicalRecord.update({
      where: {
        id: emrId,
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
      await this.updateAllergies(emrId, emr.allergies || [], allergies);
    }

    if (diagnoses) {
      await this.updateDiagnoses(emrId, emr.diagnoses || [], diagnoses);
    }

    if (medicalConditions) {
      await this.updateMedicalConditions(
        emrId,
        emr.medicalConditions || [],
        medicalConditions,
      );
    }

    if (surgeries) {
      await this.updateSurgeries(emrId, emr.surgeries || [], surgeries);
    }

    if (medications) {
      await this.updateMedications(emrId, emr.medications || [], medications);
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

  async updateMedicalConditions(
    emrId: string,
    patientMedicalConditions: PatientMedicalCondition[],
    medicalConditions: PatientMedicalConditionsDto,
  ): Promise<boolean> {
    try {
      // Create new medical conditions
      await Promise.all(
        medicalConditions.new.map(async (medicalCondition) => {
          if (
            patientMedicalConditions.find(
              (patientMedicalCondition) =>
                patientMedicalCondition.medicalConditionId ===
                medicalCondition.medicalConditionId,
            )
          ) {
            return;
          }

          const currentMedicalCondition =
            await this.medicalConditionsService.findById(
              medicalCondition.medicalConditionId,
            );

          if (currentMedicalCondition) {
            return this.prisma.patientMedicalCondition.create({
              data: {
                emrId,
                medicalConditionId: currentMedicalCondition.id,
                notes: medicalCondition.notes,
                date: medicalCondition.date,
              },
            });
          }
        }),
      );

      // Update existing medical conditions
      await Promise.all(
        medicalConditions.updated.map(async (medicalCondition) => {
          const currentPatientMedicalCondition = patientMedicalConditions.find(
            (patientMedicalCondition) =>
              patientMedicalCondition.medicalConditionId ===
              medicalCondition.medicalConditionId,
          );

          if (currentPatientMedicalCondition) {
            return this.prisma.patientMedicalCondition.update({
              where: {
                id: currentPatientMedicalCondition.id,
              },
              data: {
                notes: medicalCondition.notes,
                date: medicalCondition.date,
              },
            });
          }
        }),
      );

      // Delete medical conditions
      await Promise.all(
        medicalConditions.deleted.map(async (id) => {
          const currentPatientMedicalCondition = patientMedicalConditions.find(
            (patientMedicalCondition) =>
              patientMedicalCondition.medicalConditionId === id,
          );

          if (currentPatientMedicalCondition) {
            return this.prisma.patientMedicalCondition.delete({
              where: {
                id: currentPatientMedicalCondition.id,
              },
            });
          }
        }),
      );

      return true;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to update medical conditions');
    }
  }

  async updateSurgeries(
    emrId: string,
    patientSurgeries: PatientSurgery[],
    surgeries: PatientSurgeriesDto,
  ): Promise<boolean> {
    try {
      // Create new surgeries
      await Promise.all(
        surgeries.new.map(async (surgery) => {
          if (
            patientSurgeries.find(
              (patientSurgery) =>
                patientSurgery.surgeryId === surgery.surgeryId,
            )
          ) {
            return;
          }

          const currentSurgery = await this.surgeriesService.findById(
            surgery.surgeryId,
          );

          if (currentSurgery) {
            return this.prisma.patientSurgery.create({
              data: {
                emrId,
                surgeryId: currentSurgery.id,
                notes: surgery.notes,
                date: surgery.date,
              },
            });
          }
        }),
      );

      // Update existing surgeries
      await Promise.all(
        surgeries.updated.map(async (surgery) => {
          const currentPatientSurgery = patientSurgeries.find(
            (patientSurgery) => patientSurgery.surgeryId === surgery.surgeryId,
          );

          if (currentPatientSurgery) {
            return this.prisma.patientSurgery.update({
              where: {
                id: currentPatientSurgery.id,
              },
              data: {
                notes: surgery.notes,
                date: surgery.date,
              },
            });
          }
        }),
      );

      // Delete surgeries
      await Promise.all(
        surgeries.deleted.map(async (id) => {
          const currentPatientSurgery = patientSurgeries.find(
            (patientSurgery) => patientSurgery.surgeryId === id,
          );

          if (currentPatientSurgery) {
            return this.prisma.patientSurgery.delete({
              where: {
                id: currentPatientSurgery.id,
              },
            });
          }
        }),
      );

      return true;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to update surgeries');
    }
  }

  async updateMedications(
    emrId: string,
    patientMedications: PatientMedication[],
    medications: PatientMedicationsDto,
  ): Promise<boolean> {
    try {
      // Create new medications
      await Promise.all(
        medications.new.map(async (medication) => {
          if (
            patientMedications.find(
              (patientMedication) =>
                patientMedication.medicationId === medication.medicationId,
            )
          ) {
            return;
          }

          const currentMedication = await this.medicationsService.findById(
            medication.medicationId,
          );

          if (currentMedication) {
            return this.prisma.patientMedication.create({
              data: {
                emrId,
                medicationId: currentMedication.id,
                notes: medication.notes,
                startDate: medication.startDate,
                endDate: medication.endDate,
                dosage: medication.dosage,
                frequency: medication.frequency,
                required: medication.required,
              },
            });
          }
        }),
      );

      // Update existing medications
      await Promise.all(
        medications.updated.map(async (medication) => {
          const currentPatientMedication = patientMedications.find(
            (patientMedication) =>
              patientMedication.medicationId === medication.medicationId,
          );

          if (currentPatientMedication) {
            return this.prisma.patientMedication.update({
              where: {
                id: currentPatientMedication.id,
              },
              data: {
                notes: medication.notes,
                startDate: medication.startDate,
                endDate: medication.endDate,
                dosage: medication.dosage,
                frequency: medication.frequency,
                required: medication.required,
              },
            });
          }
        }),
      );

      // Delete medications
      await Promise.all(
        medications.deleted.map(async (id) => {
          const currentPatientMedication = patientMedications.find(
            (patientMedication) => patientMedication.medicationId === id,
          );

          if (currentPatientMedication) {
            return this.prisma.patientMedication.delete({
              where: {
                id: currentPatientMedication.id,
              },
            });
          }
        }),
      );

      return true;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to update medications');
    }
  }
}
