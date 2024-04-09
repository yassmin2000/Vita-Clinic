import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { DiagnosesModule } from './diagnoses/diagnoses.module';
import { MedicalConditionsModule } from './medical-conditions/medical-conditions.module';
import { AllergiesModule } from './allergies/allergies.module';
import { MedicationsService } from './medications/medications.service';
import { MedicationsController } from './medications/medications.controller';
import { MedicationsModule } from './medications/medications.module';
import { SurgeriesModule } from './surgeries/surgeries.module';
import { ModalitiesService } from './modalities/modalities.service';
import { ModalitiesController } from './modalities/modalities.controller';
import { ModalitiesModule } from './modalities/modalities.module';
import { BiomarkersModule } from './biomarkers/biomarkers.module';
import { LaboratoryTestsService } from './laboratory-tests/laboratory-tests.service';
import { LaboratoryTestsController } from './laboratory-tests/laboratory-tests.controller';
import { LaboratoryTestsModule } from './laboratory-tests/laboratory-tests.module';

@Module({
  controllers: [
    SettingsController,
    MedicationsController,
    ModalitiesController,
    LaboratoryTestsController,
  ],
  providers: [
    SettingsService,
    MedicationsService,
    ModalitiesService,
    LaboratoryTestsService,
  ],
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
