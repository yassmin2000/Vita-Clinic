import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { DiagnosesModule } from './diagnoses/diagnoses.module';
import { MedicalConditionsModule } from './medical-conditions/medical-conditions.module';
import { AllergiesModule } from './allergies/allergies.module';
import { MedicationsModule } from './medications/medications.module';
import { SurgeriesModule } from './surgeries/surgeries.module';
import { ModalitiesModule } from './modalities/modalities.module';
import { BiomarkersModule } from './biomarkers/biomarkers.module';
import { LaboratoryTestsModule } from './laboratory-tests/laboratory-tests.module';

@Module({
  controllers: [SettingsController],
  providers: [SettingsService],
  imports: [
    DiagnosesModule,
    MedicalConditionsModule,
    AllergiesModule,
    MedicationsModule,
    SurgeriesModule,
    ModalitiesModule,
    BiomarkersModule,
    LaboratoryTestsModule,
  ],
})
export class SettingsModule {}
