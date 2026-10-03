"use client";

import { Minus, Plus } from "lucide-react";

interface QuantityStepperProps {
  value: number;
  max: number;
  onChange: (value: number) => void;
  label?: string;
}

export function QuantityStepper({ value, max, onChange, label = "Quantity" }: QuantityStepperProps) {
  const button =
    "grid size-9 place-items-center text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div role="group" aria-label={label} className="inline-flex items-center rounded-full border border-gray-300 bg-white">
      <button type="button" className={`${button} rounded-l-full`} onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label="Decrease quantity">
        <Minus className="size-4" aria-hidden />
      </button>
      <span className="w-8 text-center text-sm font-semibold tabular-nums" aria-live="polite">
        {value}
      </span>
      <button type="button" className={`${button} rounded-r-full`} onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="Increase quantity">
        <Plus className="size-4" aria-hidden />
      </button>
    </div>
  );
}
