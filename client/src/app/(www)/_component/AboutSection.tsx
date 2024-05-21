import Link from 'next/link';
import Image from 'next/image';
import { Cross, GraduationCap, Microscope } from 'lucide-react';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function AboutSection() {
  return (
    <div id="about" className="container py-16">
      <div className="block items-center justify-between md:flex">
        <div className="w-full md:max-w-[60%]">
          <h2 className="text-4xl font-bold text-primary">About Us</h2>
          <p className="mt-2 text-muted-foreground">
            At Vita Clinic, we provide exceptional oncology care with a focus on
            personalized treatment plans, advanced technology, and compassionate
            support. Our experienced team is dedicated to improving patient
            outcomes and enhancing quality of life.
          </p>

          <div className="mt-8 flex flex-col items-center gap-8 md:flex-row md:gap-6">
            <div className="w-full md:w-1/2">
              <h3 className="text-2xl font-bold text-primary">
                Why People Choose Us?
              </h3>
              <p className="mt-1 text-muted-foreground">
                Patients choose Vita Clinic for our cutting-edge treatments,
                personalized care plans tailored to each individual, and our
                compassionate support team dedicated to improving every
                patient&apos;s quality of life.
              </p>
            </div>

            <div className="flex w-full flex-1 flex-col gap-2.5">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary">
                  <Microscope className="h-6 w-6 text-white" />
                </div>
                <p className="flex-1 text-muted-foreground">
                  State-of-the-art equipment for accurate diagnosis and
                  effective treatment.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <p className="flex-1 text-muted-foreground">
                  Highly experienced specialists dedicated to patient-centered
                  cancer care.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary">
                  <Cross className="h-6 w-6 text-white" />
                </div>
                <p className="flex-1 text-muted-foreground">
                  Holistic approach including supportive services and
                  personalized treatment plans.
                </p>
              </div>
            </div>
          </div>

          <Link href="#" className={cn(buttonVariants(), 'mt-6 rounded-full')}>
            Book Your First Appointment Now
          </Link>
        </div>
        <div className="hidden max-w-[25%] md:block">
          <Image
            src="https://images.unsplash.com/photo-1638202993928-7267aad84c31?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80"
            alt="Services"
            className="rounded-lg"
            width={971}
            height={1481}
          />
        </div>
      </div>
    </div>
  );
}
