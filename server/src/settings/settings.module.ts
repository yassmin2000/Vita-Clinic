import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { SurgeryController } from './surgery/surgery.controller';
import { SurgeryService } from './surgery/surgery.service';
import { SurgeryModule } from './surgery/surgery.module';
import { ModalityModule } from './modality/modality.module';
import { MedicalConditionService } from './medical-condition/medical-condition.service';
import { MedicalConditionController } from './medical-condition/medical-condition.controller';
import { MedicalConditionModule } from './medical-condition/medical-condition.module';
import { AllergyModule } from './allergy/allergy.module';
import { DiagnosisService } from './diagnosis/diagnosis.service';
import { DiagnosisController } from './diagnosis/diagnosis.controller';
import { DiagnosisModule } from './diagnosis/diagnosis.module';
import { MedicationModule } from './medication/medication.module';
import { BiomarkModule } from './biomark/biomark.module';
import { LaboratoryTestService } from './laboratory-test/laboratory-test.service';
import { LaboratoryTestController } from './laboratory-test/laboratory-test.controller';
import { LaboratoryTestModule } from './laboratory-test/laboratory-test.module';

@Module({
  providers: [
    SettingsService,
    SurgeryService,
    MedicalConditionService,
    DiagnosisService,
    LaboratoryTestService,
  ],
  controllers: [
    SettingsController,
    SurgeryController,
    MedicalConditionController,
    DiagnosisController,
    LaboratoryTestController,
  ],
  imports: [
    SurgeryModule,
    ModalityModule,
    MedicalConditionModule,
    AllergyModule,
    DiagnosisModule,
    MedicationModule,
    BiomarkModule,
    LaboratoryTestModule,
  ],
})
export class SettingsModule {}
