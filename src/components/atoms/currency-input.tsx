"use client";

import { useState, useEffect } from "react";
import { Input, type InputProps } from "@/components/atoms/input";
import { formatARS, parseCurrencyInput } from "@/lib/format";

interface CurrencyInputProps extends Omit<InputProps, "value" | "onChange"> {
  value: string;
  onChange: (value: string) => void;
}

export function CurrencyInput({ value, onChange, ...props }: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    if (value) {
      const num = parseCurrencyInput(value);
      setDisplayValue(formatARS(num));
    } else {
      setDisplayValue("");
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    onChange(raw);
  };

  const handleBlur = () => {
    if (displayValue) {
      const num = parseCurrencyInput(displayValue);
      setDisplayValue(formatARS(num));
    }
  };

  return (
    <Input
      {...props}
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      inputMode="decimal"
      placeholder="$ 0,00"
    />
  );
}
