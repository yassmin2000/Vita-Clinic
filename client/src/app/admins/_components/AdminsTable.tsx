'use client';

import { useQuery } from '@tanstack/react-query';
import { admins as adminsData } from './adminsData';
import { useCallback, useEffect, useState } from 'react';
import { differenceInYears, parseISO, format } from 'date-fns';
import { Button, buttonVariants } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Plus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { DataTable } from '@/components/DataTable';
import { columns } from './AdminColumn';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
// @ts-ignore
import debounce from 'lodash.debounce';
import Link from 'next/link';

export default function AdminsTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [countPerPage, setCountPerPage] = useState(10);
  const [currentGender, setCurrentGender] = useState('all');
  const [searchValue, setSearchValue] = useState('');
  const [sortBy, setSortBy] = useState('joinedAt-desc');

  const {
    data: admins,
    refetch,
    isFetched,
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: [
      `admin_page_${currentPage}_count_${countPerPage}_gender_${currentGender}_sort_${sortBy}_search_${searchValue}`,
    ],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const [sortWith, sortHow] = sortBy.split('-');
      if (
        sortWith !== 'name' &&
        sortWith !== 'joinedAt' &&
        sortWith !== 'birthDate'
      )
        return null;

      return adminsData
        .filter(
          (admin) =>
            (currentGender === 'all' ||
              admin.gender.toLowerCase() === currentGender) &&
            (admin.name.toLowerCase().includes(searchValue.toLowerCase()) ||
              admin.email.toLowerCase().includes(searchValue.toLowerCase()))
        )
        .sort((a, b) => {
          if (a[sortWith] < b[sortWith]) {
            return sortHow === 'desc' ? 1 : -1;
          }
          if (a[sortWith] > b[sortWith]) {
            return sortHow === 'desc' ? -1 : 1;
          }
          return 0;
        })
        .slice((currentPage - 1) * countPerPage, currentPage * countPerPage);
    },
  });

  const request = debounce(async () => {
    refetch();
  }, 500);

  const debounceRequest = useCallback(() => {
    request();
  }, []);

  return (
    <>
      <div className="flex flex-col justify-between gap-8 md:flex-row">
        <div className="flex flex-col gap-2 sm:flex-row">
          <Tabs
            value={currentGender}
            onValueChange={(value) => {
              setCurrentPage(1);
              setCurrentGender(value);
            }}
            className="w-[200px]"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="male">Male</TabsTrigger>
              <TabsTrigger value="female">Female</TabsTrigger>
            </TabsList>
          </Tabs>
          <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Name</SelectLabel>
                <SelectItem value="name-asc">Sort by name (A-Z)</SelectItem>
                <SelectItem value="name-desc">Sort by name (Z-A)</SelectItem>
                <SelectSeparator />
                <SelectLabel>Age</SelectLabel>
                <SelectItem value="birthDate-desc">
                  Select by age (Younged first)
                </SelectItem>
                <SelectItem value="birthDate-asc">
                  Select by age (Oldest first)
                </SelectItem>
                <SelectSeparator />
                <SelectLabel>Joined at</SelectLabel>
                <SelectItem value="joinedAt-asc">Oldest first</SelectItem>
                <SelectItem value="joinedAt-desc">Newest first</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-1 flex-col gap-2 sm:flex-row">
          <Input
            placeholder="Search by name or email address"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              debounceRequest();
            }}
          />
          <Link
            href="/user/new?role=admin"
            className={buttonVariants({
              className: 'flex w-[150px] items-center gap-1',
            })}
          >
            <Plus />
            New Admin
          </Link>
        </div>
      </div>
      <DataTable columns={columns} data={admins || []} isLoading={isLoading} />
      <div className="flex flex-col-reverse justify-between gap-2 sm:flex-row md:items-center">
        <Select>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Count per page" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Count</SelectLabel>
              <SelectItem value="count-10">10 per page</SelectItem>
              <SelectItem value="count-25">25 per page</SelectItem>
              <SelectItem value="count-50">50 per page</SelectItem>
              <SelectItem value="count-100">100 per page</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <div className="flex justify-between gap-2">
          <Button
            className="flex items-center gap-2"
            size="sm"
            onClick={() => setCurrentPage((page) => page - 1)}
            disabled={currentPage === 1 || isLoading}
          >
            <ArrowLeft />
            Previous
          </Button>

          <Button
            className="flex items-center gap-2 px-5"
            size="sm"
            onClick={() => setCurrentPage((page) => page + 1)}
            disabled={(admins && admins.length < countPerPage) || isLoading}
          >
            Next
            <ArrowRight />
          </Button>
        </div>
      </div>
    </>
  );
}
