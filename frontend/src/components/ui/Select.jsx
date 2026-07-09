import { forwardRef } from "react";

const Select = forwardRef(({ label, error, id, options = [], placeholder, className = "", ...props }, ref) => {
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
        className={`input-base cursor-pointer ${error ? "border-accent-crimson/50" : ""} ${className}`}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value ?? opt} value={opt.value ?? opt}>
            {opt.label ?? opt}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-xs text-accent-crimson mt-0.5">{error}</p>
      )}
    </div>
  );
});

Select.displayName = "Select";

export default Select;
