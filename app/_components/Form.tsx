'use client'

import { cn } from "@/libs/utils";
import { ReactNode } from "react";

type FormFieldProps = {
  label: string;
  name: string;
  id?: string;
  error?: string;
  children: ReactNode;
};

export function FormField({
  label,
  name,
  id,
  error,
  children,
}: FormFieldProps) {
  const inputId = id ?? name;

  return (
    <div className="space-y-1">
      <label
        htmlFor={inputId}
        className="font-medium text-sm"
      >
        {label}
      </label>

      {children}

      {error ? (
        <p className="h-4 text-red-500 text-xs">
          {error}
        </p>
      ) : undefined}
    </div>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "p-2 border rounded w-full",
        props.className
      )}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "p-2 border rounded w-full",
        props.className
      )}
    />
  );
}