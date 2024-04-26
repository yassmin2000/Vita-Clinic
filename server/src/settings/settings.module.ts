import { Module } from '@nestjs/common';

import { AllergiesModule } from './allergies/allergies.module';
import { BiomarkersModule } from './biomarkers/biomarkers.module';
import { DiagnosesModule } from './diagnoses/diagnoses.module';
import { LaboratoryTestsModule } from './laboratory-tests/laboratory-tests.module';
import { ManufacturersModule } from './manufacturers/manufacturers.module';
import { MedicalConditionsModule } from './medical-conditions/medical-conditions.module';
import { MedicationsModule } from './medications/medications.module';
import { ModalitiesModule } from './modalities/modalities.module';
import { ServicesModule } from './services/services.module';
import { SurgeriesModule } from './surgeries/surgeries.module';
import { SpecialitiesModule } from './specialities/specialities.module';
import { TherapiesModule } from './therapies/therapies.module';

@Module({
  imports: [
    AllergiesModule,
    BiomarkersModule,
    DiagnosesModule,
    LaboratoryTestsModule,
    ManufacturersModule,
    MedicationsModule,
    MedicalConditionsModule,
    ModalitiesModule,
    ServicesModule,
    SurgeriesModule,
    SpecialitiesModule,
    TherapiesModule,
  ],
})
export class SettingsModule {}
