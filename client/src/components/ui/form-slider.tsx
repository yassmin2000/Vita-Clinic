'use client';

import { Minus, Plus } from 'lucide-react';
import { Button } from './button';
import { Slider } from './slider';

interface FormSliderProps {
  id: string;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  min: number;
  max: number;
  unit: string;
}

export default function FormSlider({
  id,
  value,
  onChange,
  disabled = false,
  min,
  max,
  unit,
}: FormSliderProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex w-full flex-col items-center gap-0">
        <div className="flex items-center gap-6 self-center">
          <Button
            variant="outline"
            className="h-8 w-8 rounded-full p-2 text-2xl"
            type="button"
            onClick={() => {
              if (value > min) {
                onChange(value - 1);
              }
            }}
            disabled={disabled}
          >
            <Minus />
          </Button>
          <div className="text-3xl font-bold">{value}</div>
          <Button
            variant="outline"
            className="h-8 w-8 rounded-full p-2 text-2xl"
            type="button"
            onClick={() => {
              if (value < max) {
                onChange(+value + 1);
              }
            }}
            disabled={disabled}
          >
            <Plus />
          </Button>
        </div>
        <span className="text-center text-sm text-neutral-500">{unit}</span>
      </div>
      <Slider
        id={id}
        value={[value]}
        onValueChange={(val) => onChange(val[0])}
        disabled={disabled}
        max={max}
        min={min}
        step={1}
      />
    </div>
  );
}
