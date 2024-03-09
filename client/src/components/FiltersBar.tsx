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

const specialties = [
  'Neuroradiology',
  'Pediatric Radiology',
  'Breast Imaging',
  'Vascular & Interventional Radiology',
  'Musculoskeletal Radiology',
  'Nuclear Radiology',
  'Emergency Radiology',
];

interface FiltersBarProps {
  genderFilter?: boolean;
  specialtyFilter?: boolean;
  searchFilter?: boolean;
  sortingEnabled?: boolean;
  sortByNameEnabled?: boolean;
  sortByAgeEnabled?: boolean;
  sortByDateEnabled?: boolean;
  searchPlaceholder?: string;
  addNewButton?: boolean;
  addNewRoute: string;
  addNewContent: string;
  refetch: () => void;
}

export default function FiltersBar({
  genderFilter = false,
  specialtyFilter = false,
  searchFilter = false,
  sortingEnabled = false,
  sortByNameEnabled = false,
  sortByAgeEnabled = false,
  sortByDateEnabled = false,
  searchPlaceholder,
  addNewButton = true,
  addNewRoute,
  addNewContent,
  refetch,
}: FiltersBarProps) {
  const {
    currentPage,
    setCurrentPage,
    sortBy,
    setSortBy,
    searchValue,
    setSearchValue,
    currentGender,
    setCurrentGender,
  } = useTableOptions();

  const request = debounce(async () => {
    refetch();
  }, 500);

  const debounceRequest = useCallback(() => {
    request();
  }, []);

  return (
    <div className="flex flex-col justify-between gap-8 md:flex-row">
      <div className="flex flex-col gap-2 sm:flex-row">
        {genderFilter && (
          <Tabs
            value={currentGender}
            onValueChange={(value) => {
              if (value === 'all' || value === 'male' || value === 'female') {
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
                  <SelectLabel>Joined at</SelectLabel>
                  <SelectItem value="joinedAt-asc">Oldest first</SelectItem>
                  <SelectItem value="joinedAt-desc">Newest first</SelectItem>
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
