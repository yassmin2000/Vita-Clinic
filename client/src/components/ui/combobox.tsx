'use client';

import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Check, ChevronDown } from 'lucide-react';

type Status = {
  value: string;
  label: string;
};

const statuses: Status[] = [
  {
    value: 'backlog',
    label: 'Backlog',
  },
  {
    value: 'todo',
    label: 'Todo',
  },
  {
    value: 'in progress',
    label: 'In Progress',
  },
  {
    value: 'done',
    label: 'Done',
  },
  {
    value: 'canceled',
    label: 'Canceled',
  },
];

interface ComboboxProps {
  value: string;
  placeholder?: string;
  inputPlaceholder?: string;
  onChange: (value: string | null) => void;
  options: {
    value: string;
    label: string;
  }[];
  disabled?: boolean;
}

export function Combobox({
  value,
  placeholder,
  inputPlaceholder,
  onChange,
  options,
  disabled,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (isDesktop) {
    return (
      <Popover open={open && !disabled} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full items-center justify-between"
            disabled={disabled}
          >
            {value
              ? options.find((option) => option.value === value)?.label
              : placeholder || 'Select...'}

            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="center">
          <OptionsList
            inputPlaceholder={inputPlaceholder}
            setOpen={setOpen}
            onChange={onChange}
            options={options}
            value={value}
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          {value
            ? options.find((option) => option.value === value)?.label
            : placeholder || 'Select...'}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <OptionsList
            inputPlaceholder={inputPlaceholder}
            setOpen={setOpen}
            onChange={onChange}
            options={options}
            value={value}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function OptionsList({
  value,
  inputPlaceholder,
  setOpen,
  onChange,
  options,
}: {
  value: string;
  inputPlaceholder?: string;
  setOpen: (open: boolean) => void;
  onChange: (status: string | null) => void;
  options: {
    value: string;
    label: string;
  }[];
}) {
  return (
    <Command>
      <CommandInput placeholder={inputPlaceholder || 'Filter...'} />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {options.map((option) => (
            <CommandItem
              key={option.value}
              onSelect={() => {
                onChange(option.value);
                setOpen(false);
              }}
            >
              {value === option.value && <Check className="mr-2 h-4 w-4" />}
              {option.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
