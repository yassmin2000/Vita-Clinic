'use client';

import { useCallback } from 'react';
import Link from 'next/link';
// @ts-ignore
import debounce from 'lodash.debounce';
import { Plus } from 'lucide-react';

import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { buttonVariants } from './ui/button';

import { useTableOptions } from '@/hooks/useTableOptions';
import { cn } from '@/lib/utils';

interface FiltersBarProps {
  genderFilter?: boolean;
  statusFilter?: boolean;
  appointmentsVisibleFilter?: boolean;
  appointmentStatusFilter?: boolean;
  searchFilter?: boolean;
  sortingEnabled?: boolean;
  sortByNameEnabled?: boolean;
  sortByPatientNameEnabled?: boolean;
  sortByDoctorNameEnabled?: boolean;
  sortByAgeEnabled?: boolean;
  sortByDateEnabled?: boolean;
  sortByActiveEnabled?: boolean;
  dateTitle?: string;
  sortByLastMaintenanceDateEnabled?: boolean;
  sortByPurchaseDateEnabled?: boolean;
  sortByAppointmentDateEnabled?: boolean;
  sortByActionDateEnabled?: boolean;
  searchPlaceholder?: string;
  addNewButton?: boolean;
  addNewRoute?: string;
  addNewContent?: string;
  refetch: () => void;
}

export default function FiltersBar({
  genderFilter = false,
  statusFilter = false,
  appointmentsVisibleFilter = false,
  appointmentStatusFilter = false,
  searchFilter = false,
  sortingEnabled = false,
  sortByNameEnabled = false,
  sortByPatientNameEnabled = false,
  sortByDoctorNameEnabled = false,
  sortByAgeEnabled = false,
  sortByDateEnabled = false,
  sortByActiveEnabled = false,
  dateTitle = 'Joined at',
  sortByLastMaintenanceDateEnabled = false,
  sortByPurchaseDateEnabled = false,
  sortByAppointmentDateEnabled = false,
  sortByActionDateEnabled = false,
  searchPlaceholder,
  addNewButton = false,
  addNewRoute = '',
  addNewContent,
  refetch,
}: FiltersBarProps) {
  const {
    setCurrentPage,
    sortBy,
    setSortBy,
    searchValue,
    setSearchValue,
    currentGender,
    setCurrentGender,
    currentStatus,
    setCurrentStatus,
    currentAppointmentStatus,
    setCurrentAppointmentStatus,
    currentVisibleAppointments,
    setCurrentVisibleAppointments,
  } = useTableOptions();

  const request = debounce(async () => {
    refetch();
  }, 500);

  const debounceRequest = useCallback(() => {
    request();
  }, []);

  return (
    <div className="flex flex-col justify-between gap-8 md:flex-row md:flex-wrap">
      <div className="flex flex-col gap-2 sm:flex-row">
        {genderFilter || statusFilter ? (
          <div className="flex flex-wrap gap-2">
            {genderFilter && (
              <Tabs
                value={currentGender}
                onValueChange={(value) => {
                  if (
                    value === 'all' ||
                    value === 'male' ||
                    value === 'female'
                  ) {
                    setCurrentPage(1);
                    setCurrentGender(value);
                  }
                }}
                className="w-[200px]"
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="male">Male</TabsTrigger>
                  <TabsTrigger value="female">Female</TabsTrigger>
                </TabsList>
              </Tabs>
            )}

            {statusFilter && (
              <Tabs
                value={currentStatus}
                onValueChange={(value) => {
                  if (
                    value === 'all' ||
                    value === 'active' ||
                    value === 'inactive'
                  ) {
                    setCurrentPage(1);
                    setCurrentStatus(value);
                  }
                }}
                className="w-[200px]"
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="inactive">Inactive</TabsTrigger>
                </TabsList>
              </Tabs>
            )}
          </div>
        ) : null}

        {appointmentsVisibleFilter || appointmentStatusFilter ? (
          <div className="flex flex-wrap gap-2">
            {appointmentsVisibleFilter && (
              <Tabs
                value={currentVisibleAppointments}
                onValueChange={(value) => {
                  if (value === 'all' || value === 'yours') {
                    setCurrentPage(1);
                    setCurrentVisibleAppointments(value);
                  }
                }}
                className="w-[200px]"
              >
                <TabsList className="w-full">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="yours">Your Appointments</TabsTrigger>
                </TabsList>
              </Tabs>
            )}

            {appointmentStatusFilter && (
              <Tabs
                value={currentAppointmentStatus}
                onValueChange={(value) => {
                  if (
                    value === 'all' ||
                    value === 'completed' ||
                    value === 'pending' ||
                    value === 'cancelled' ||
                    value === 'rejected' ||
                    value === 'approved'
                  ) {
                    setCurrentPage(1);
                    setCurrentAppointmentStatus(value);
                  }
                }}
                className={cn(
                  currentVisibleAppointments === 'yours'
                    ? 'w-[350px]'
                    : 'w-[500px]'
                )}
              >
                <TabsList
                  className={cn(
                    'grid w-full',
                    currentVisibleAppointments === 'yours'
                      ? 'grid-cols-4'
                      : 'grid-cols-6'
                  )}
                >
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="approved">Approved</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                  {currentVisibleAppointments === 'all' && (
                    <>
                      <TabsTrigger value="pending">Pending</TabsTrigger>
                      <TabsTrigger value="rejected">Rejected</TabsTrigger>
                    </>
                  )}
                  <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                </TabsList>
              </Tabs>
            )}
          </div>
        ) : null}

        {sortingEnabled && (
          <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortByNameEnabled && (
                <SelectGroup>
                  <SelectLabel>Name</SelectLabel>
                  <SelectItem value="name-asc">Sort by name (A-Z)</SelectItem>
                  <SelectItem value="name-desc">Sort by name (Z-A)</SelectItem>
                  <SelectSeparator />
                </SelectGroup>
              )}

              {sortByPatientNameEnabled && (
                <SelectGroup>
                  <SelectLabel>Patient Name</SelectLabel>
                  <SelectItem value="patientName-asc">
                    Sort by patient name (A-Z)
                  </SelectItem>
                  <SelectItem value="patientName-desc">
                    Sort by patient name (Z-A)
                  </SelectItem>
                  <SelectSeparator />
                </SelectGroup>
              )}

              {sortByDoctorNameEnabled && (
                <SelectGroup>
                  <SelectLabel>Doctor Name</SelectLabel>
                  <SelectItem value="doctorName-asc">
                    Sort by doctor name (A-Z)
                  </SelectItem>
                  <SelectItem value="doctorName-desc">
                    Sort by doctor name (Z-A)
                  </SelectItem>
                  <SelectSeparator />
                </SelectGroup>
              )}

              {sortByAgeEnabled && (
                <SelectGroup>
                  <SelectLabel>Age</SelectLabel>
                  <SelectItem value="birthDate-desc">
                    Select by age (Younged first)
                  </SelectItem>
                  <SelectItem value="birthDate-asc">
                    Select by age (Oldest first)
                  </SelectItem>
                  <SelectSeparator />
                </SelectGroup>
              )}

              {sortByDateEnabled && (
                <SelectGroup>
                  <SelectLabel>{dateTitle}</SelectLabel>
                  <SelectItem value="createdAt-asc">Oldest first</SelectItem>
                  <SelectItem value="createdAt-desc">Newest first</SelectItem>
                </SelectGroup>
              )}

              {sortByActiveEnabled && (
                <SelectGroup>
                  <SelectLabel>Status</SelectLabel>
                  <SelectItem value="isActive-desc">Active first</SelectItem>
                  <SelectItem value="isActive-asc">Inactive first</SelectItem>
                </SelectGroup>
              )}

              {sortByLastMaintenanceDateEnabled && (
                <SelectGroup>
                  <SelectLabel>Last maintenance date</SelectLabel>
                  <SelectItem value="lastMaintenanceDate-asc">
                    Last maintained last
                  </SelectItem>
                  <SelectItem value="lastMaintenanceDate-desc">
                    Last maintained first
                  </SelectItem>
                </SelectGroup>
              )}

              {sortByPurchaseDateEnabled && (
                <SelectGroup>
                  <SelectLabel>Purchase date</SelectLabel>
                  <SelectItem value="purchaseDate-asc">Oldest first</SelectItem>
                  <SelectItem value="purchaseDate-desc">
                    Newest first
                  </SelectItem>
                </SelectGroup>
              )}

              {sortByAppointmentDateEnabled && (
                <>
                  <SelectGroup>
                    <SelectLabel>Appointment date</SelectLabel>
                    <SelectItem value="date-asc">Oldest first</SelectItem>
                    <SelectItem value="date-desc">Newest first</SelectItem>
                  </SelectGroup>

                  <SelectGroup>
                    <SelectLabel>Booked at</SelectLabel>
                    <SelectItem value="bookingDate-asc">
                      Oldest first
                    </SelectItem>
                    <SelectItem value="bookingDate-desc">
                      Newest first
                    </SelectItem>
                  </SelectGroup>
                </>
              )}

              {sortByActionDateEnabled && (
                <SelectGroup>
                  <SelectLabel>Action date</SelectLabel>
                  <SelectItem value="date-asc">Oldest first</SelectItem>
                  <SelectItem value="date-desc">Newest first</SelectItem>
                </SelectGroup>
              )}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 sm:flex-row">
        {searchFilter && (
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              debounceRequest();
            }}
          />
        )}
        {addNewButton && (
          <Link
            href={addNewRoute}
            className={buttonVariants({
              className: 'flex w-[150px] items-center gap-1',
            })}
          >
            <Plus />
            {addNewContent}
          </Link>
        )}
      </div>
    </div>
  );
}
