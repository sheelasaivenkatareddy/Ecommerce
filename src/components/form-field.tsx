import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";

const control =
  "mt-1.5 block w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-gray-900 transition outline-none focus:ring-2";
const valid = "border-gray-300 focus:border-indigo-500 focus:ring-indigo-100";
const invalid = "border-red-400 focus:border-red-500 focus:ring-red-100";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  error?: string;
}

export function Field({ label, name, error, className, ...input }: FieldProps) {
  const errorId = `${name}-error`;
  return (
    <div className={className}>
      <label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={name}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`${control} ${error ? invalid : valid}`}
        {...input}
      />
      {error && (
        <p id={errorId} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  name: string;
  options: readonly string[];
  placeholder: string;
  error?: string;
}

export function SelectField({ label, name, options, placeholder, error, className, ...select }: SelectFieldProps) {
  const errorId = `${name}-error`;
  return (
    <div className={className}>
      <label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <select
        id={name}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`${control} ${error ? invalid : valid}`}
        {...select}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error && (
        <p id={errorId} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export function FormAlert({ children }: { children: ReactNode }) {
  return (
    <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {children}
    </p>
  );
}
