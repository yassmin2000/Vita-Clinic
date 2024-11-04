import { differenceInYears, parseISO } from 'date-fns';
import { Sex } from '@prisma/client';

import { AgeGroup } from '../dto/dashboards.dto';

export function processInvoicesData(
  startDate: Date,
  endDate: Date,
  data: {
    date: Date;
    _sum: {
      amount: number;
    };
  }[],
) {
  const processedData: { x: string; y: number }[] = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const date = currentDate.toISOString().split('T')[0];
    const entry = data.reduce(
      (acc, item) => {
        const itemDate = item.date.toISOString().split('T')[0];
        if (itemDate === date) {
          acc.y += item._sum.amount;
        }
        return acc;
      },
      { x: date, y: 0 },
    );

    processedData.push(entry);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return processedData;
}

export function processAppointmentsData(
  data: {
    date: Date;
    _count: number;
  }[],
) {
  const processedData: { day: string; value: number }[] = data.reduce(
    (acc, item) => {
      const date = item.date.toISOString().split('T')[0];

      let entry: { day: string; value: number } = acc.find(
        (entry) => entry.day === date,
      );
      if (!entry) {
        entry = {
          day: date,
          value: 0,
        };
        acc.push(entry);
      }
      entry.value += item._count;

      return acc;
    },
    [],
  );

  return processedData;
}

export function processPatientsData(data: { sex: Sex; birthDate: Date }[]) {
  const ageGroups = [
    '0-6',
    '7-12',
    '13-18',
    '19-30',
    '31-36',
    '37-42',
    '43-48',
    '49-54',
    '55-60',
    '+61',
  ];

  const processedData: {
    ageGroup: AgeGroup;
    male: number;
    female: number;
  }[] = data
    .reduce((acc, item) => {
      const birthDate = item.birthDate.toISOString();
      const age = differenceInYears(new Date(), parseISO(birthDate));
      let ageGroup = ageGroups.find((group) => {
        const [min, max] = group.split('-').map(Number);
        return age >= min && age <= max;
      });
      if (!ageGroup) {
        ageGroup = '+61';
      }
      let entry: { ageGroup: string; male: number; female: number } = acc.find(
        (entry) => entry.ageGroup === ageGroup,
      );
      if (!entry) {
        entry = {
          ageGroup: ageGroup,
          male: 0,
          female: 0,
        };
        acc.push(entry);
      }
      if (item.sex === 'male') {
        entry.male += 1;
      } else {
        entry.female += 1;
      }
      return acc;
    }, [])
    .sort(
      (a, b) => ageGroups.indexOf(a.ageGroup) - ageGroups.indexOf(b.ageGroup),
    );

  return processedData;
}
