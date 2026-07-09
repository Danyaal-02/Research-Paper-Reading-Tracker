import { forwardRef, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-surface-300">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={`input-base ${
            error
              ? "border-accent-crimson/50 focus:border-accent-crimson focus:shadow-[0_0_0_3px_rgba(220,38,38,0.15)]"
              : ""
          } ${className}`}
          {...props}
        />
        {error && (
          <p className="text-xs text-accent-crimson mt-0.5">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
