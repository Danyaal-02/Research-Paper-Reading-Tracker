import { forwardRef, SelectHTMLAttributes } from "react";

export interface Option {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options?: (Option | string)[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, id, options = [], placeholder, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-surface-300">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={id}
          className={`input-base cursor-pointer ${
            error ? "border-accent-crimson/50" : ""
          } ${className}`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => {
            const value = typeof opt === "string" ? opt : opt.value;
            const labelStr = typeof opt === "string" ? opt : opt.label;
            return (
              <option key={value} value={value}>
                {labelStr}
              </option>
            );
          })}
        </select>
        {error && (
          <p className="text-xs text-accent-crimson mt-0.5">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
