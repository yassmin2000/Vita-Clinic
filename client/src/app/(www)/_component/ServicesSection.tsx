import { Cross } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Icons } from '@/components/Icons';

export default function ServicesSection() {
  return (
    <div id="services" className="container py-16">
      <div className="flex items-center justify-center">
        <div>
          <h2 className="text-4xl font-bold text-primary">Our Services</h2>
          <p className="mt-2 text-muted-foreground">
            At Vita Clinic, we offer a wide range of oncology services including
            advanced diagnostics, personalized treatment plans, and supportive
            services to enhance patient outcomes and quality of life.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col items-center gap-1.5">
                  <Icons.treatmentService className="h-12 w-12" />
                  <h3 className="text-center font-semibold text-primary">
                    Oncology Treatments
                  </h3>
                </div>
                <div className="mt-2.5">
                  Personalized plans including chemotherapy, radiation,
                  immunotherapy, and targeted therapy to combat cancer
                  effectively.
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col items-center gap-1.5">
                  <Icons.imagingService className="h-12 w-12" />
                  <h3 className="text-center font-semibold text-primary">
                    Imaging & Laboratory Services
                  </h3>
                </div>
                <div className="mt-2.5">
                  Advanced imaging (PET, CT, MRI, X-rays) and on-site lab tests
                  ensure precise diagnostics and timely results.
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col items-center gap-1.5">
                  <Icons.technologyService className="h-12 w-12" />
                  <h3 className="text-center font-semibold text-primary">
                    Electronic Medical Records
                  </h3>
                </div>
                <div className="mt-2.5">
                  Secure EMR system with patient portal access for real-time
                  medical records and communication with the healthcare team.
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col items-center gap-1.5">
                  <Cross className="h-12 w-12 text-primary" />
                  <h3 className="font-semibold text-primary">
                    Supportive Care
                  </h3>
                </div>
                <div className="mt-2.5">
                  Nutritional counseling, pain management, psychological
                  support, and rehabilitation to enhance patient well-being and
                  quality of life.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
