'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';

import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import StaffSidebar from './StaffSidebar';
import PatientsSidebar from './PatientsSidebar';

interface MobileSidebarProps {
  role: string;
}

export default function MobileSidebar({ role }: MobileSidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <SheetTrigger className="pr-4 md:hidden">
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="w-fit bg-secondary p-0 pt-10">
        {role === 'patient' ? <PatientsSidebar /> : <StaffSidebar />}
      </SheetContent>
    </Sheet>
  );
}
