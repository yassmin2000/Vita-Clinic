import { ArrowLeft, ArrowRight } from 'lucide-react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Button } from './ui/button';

import { useFiltersStore } from '@/hooks/useFiltersStore';

interface PaginationProps {
  previousDisabled: boolean;
  nextDisabled: boolean;
}

export default function Pagination({
  previousDisabled,
  nextDisabled,
}: PaginationProps) {
  const { countPerPage, setCountPerPage, currentPage, setCurrentPage } =
    useFiltersStore();

  return (
    <div className="flex flex-col-reverse justify-between gap-2 sm:flex-row md:items-center">
      <Select
        value={countPerPage.toString()}
        onValueChange={(value) => {
          setCurrentPage(1);
          setCountPerPage(Number(value));
        }}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Count per page" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Count</SelectLabel>
            <SelectItem value="10">10 per page</SelectItem>
            <SelectItem value="25">25 per page</SelectItem>
            <SelectItem value="50">50 per page</SelectItem>
            <SelectItem value="100">100 per page</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <div className="flex justify-between gap-2">
        <Button
          className="flex items-center gap-2"
          size="sm"
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={previousDisabled}
        >
          <ArrowLeft />
          Previous
        </Button>

        <Button
          className="flex items-center gap-2 px-5"
          size="sm"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={nextDisabled}
        >
          Next
          <ArrowRight />
        </Button>
      </div>
    </div>
  );
}
