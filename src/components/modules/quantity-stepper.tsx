"use client";

import { IconMinus, IconPlus } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = Infinity,
  className,
}: QuantityStepperProps) {
  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md border",
        className,
      )}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-8 rounded-none"
        onClick={dec}
        disabled={value <= min}
        aria-label="Decrease quantity"
      >
        <IconMinus className="size-4" />
      </Button>
      <span className="w-9 text-center text-sm tabular-nums">{value}</span>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-8 rounded-none"
        onClick={inc}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        <IconPlus className="size-4" />
      </Button>
    </div>
  );
}
