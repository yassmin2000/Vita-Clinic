'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import { devices as devicesData } from './devicesData';

import DeviceCard from './DeviceCard';
import DeviceCardSkeleton from './DeviceCardSkeleton';
import FiltersBar from '@/components/FiltersBar';
import Pagination from '@/components/Pagination';

import { useTableOptions } from '@/hooks/useTableOptions';

export default function DeviceCardsGrid() {
  const {
    sortBy,
    setSortBy,
    searchValue,
    currentPage,
    countPerPage,
    currentStatus,
    reset,
  } = useTableOptions();

  const {
    data: devices,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: [
      `devices_page_${currentPage}_status_${currentStatus}_count_${countPerPage}_sort_${sortBy}_search_${searchValue}_count_${countPerPage}`,
    ],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const [sortWith, sortHow] = sortBy.split('-');
      if (
        sortWith !== 'name' &&
        sortWith !== 'purchaseDate' &&
        sortWith !== 'lastMaintenanceDate'
      )
        return null;

      return devicesData
        .filter(
          (device) =>
            (currentStatus === 'all' ||
              device.status.toLowerCase() === currentStatus) &&
            (device.name.toLowerCase().includes(searchValue.toLowerCase()) ||
              device.manufacturer
                .toLowerCase()
                .includes(searchValue.toLowerCase()))
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

  useEffect(() => {
    reset();
    setSortBy('purchaseDate-desc');
  }, []);

  return (
    <>
      <FiltersBar
        refetch={refetch}
        statusFilter
        searchFilter
        searchPlaceholder="Search by device name or manufacturer"
        sortingEnabled
        sortByNameEnabled
        sortByPurchaseDateEnabled
        sortByLastMaintenanceDateEnabled
        addNewButton
        addNewRoute="/devices/new"
        addNewContent="New Device"
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {isLoading &&
          Array.from({ length: 7 }).map((_, index) => (
            <DeviceCardSkeleton key={index} />
          ))}
        {devices && devices.length === 0 && <p>No devices found</p>}
        {devices &&
          devices.length > 0 &&
          devices.map((device) => (
            <DeviceCard
              id={device.id}
              key={device.id}
              deviceName={device.name}
              deviceImage={device.deviceImage}
              manufacturer={device.manufacturer}
              lastMaintenanceDate={device.lastMaintenanceDate}
              purchaseDate={device.purchaseDate}
              status={device.status}
              serialNumber={device.serialNumber}
            />
          ))}
      </div>

      <Pagination
        previousDisabled={currentPage === 1 || isLoading}
        nextDisabled={(devices && devices.length < countPerPage) || isLoading}
      />
    </>
  );
}
