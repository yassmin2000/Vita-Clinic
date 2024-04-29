import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DiagnosesTable from './_components/DiagnosesTable';
import MedicalConditionsTable from './_components/MedicalConditionsTable';
import AllergiesTable from './_components/AllergiesTable';
import MedicationsTable from './_components/MedicationsTable';
import SurgeriesTable from './_components/SurgeriesTable';
import ModalitiesTable from './_components/ModalitiesTable';
import BiomarkersTable from './_components/BiomarkersTable';
import LaboratoryTestsTable from './_components/LaboratoryTestsTable';
import ServicesTable from './_components/ServicesTable';
import TherapiesTable from './_components/TherapiesTable';
import SpecialitiesTable from './_components/SpecialitiesTable';
import ManufacturersTable from './_components/ManufacturersTable';

export default function SettingsPage() {
  return (
    <section className="container mx-auto px-2 py-8 md:px-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-semibold uppercase text-primary">
            Settings
          </h2>
          <h3 className="text-base text-muted-foreground">
            Manage your clinic settings
          </h3>
        </div>
        <Tabs defaultValue="diagnoses">
          <TabsList className="flex h-full w-fit flex-wrap justify-start gap-0.5">
            <TabsTrigger value="diagnoses">Diagnoses</TabsTrigger>
            <TabsTrigger value="medical-conditions">
              Medical Conditions
            </TabsTrigger>
            <TabsTrigger value="allergies">Allergies</TabsTrigger>
            <TabsTrigger value="medications">Medications</TabsTrigger>
            <TabsTrigger value="surgeries">Surgeries</TabsTrigger>
            <TabsTrigger value="modalities">Modalities</TabsTrigger>
            <TabsTrigger value="biomarkers">Biomarkers</TabsTrigger>
            <TabsTrigger value="laboratory-tests">Laboratory Tests</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="therapies">Therapies</TabsTrigger>
            <TabsTrigger value="specialities">Specialities</TabsTrigger>
            <TabsTrigger value="manufacturers">Manufacturers</TabsTrigger>
          </TabsList>
          <TabsContent value="diagnoses">
            <DiagnosesTable />
          </TabsContent>
          <TabsContent value="medical-conditions">
            <MedicalConditionsTable />
          </TabsContent>
          <TabsContent value="allergies">
            <AllergiesTable />
          </TabsContent>
          <TabsContent value="medications">
            <MedicationsTable />
          </TabsContent>
          <TabsContent value="surgeries">
            <SurgeriesTable />
          </TabsContent>
          <TabsContent value="modalities">
            <ModalitiesTable />
          </TabsContent>
          <TabsContent value="biomarkers">
            <BiomarkersTable />
          </TabsContent>
          <TabsContent value="laboratory-tests">
            <LaboratoryTestsTable />
          </TabsContent>
          <TabsContent value="services">
            <ServicesTable />
          </TabsContent>
          <TabsContent value="therapies">
            <TherapiesTable />
          </TabsContent>
          <TabsContent value="specialities">
            <SpecialitiesTable />
          </TabsContent>
          <TabsContent value="manufacturers">
            <ManufacturersTable />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
