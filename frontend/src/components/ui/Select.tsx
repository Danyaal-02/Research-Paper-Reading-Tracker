import { forwardRef, SelectHTMLAttributes, useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export interface Option {
  value: string;
  label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  error?: string;
  options?: (Option | string)[];
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, id, options = [], placeholder, className = "", onChange, ...props }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(props.defaultValue || props.value || "");
    const containerRef = useRef<HTMLDivElement>(null);
    const innerSelectRef = useRef<HTMLSelectElement | null>(null);

    // Merge refs so both RHF and our component can access the native select
    const setRefs = (node: HTMLSelectElement) => {
      innerSelectRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref && 'current' in ref) {
        (ref as React.MutableRefObject<HTMLSelectElement>).current = node;
      }
    };

    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Handle form reset
    useEffect(() => {
      const form = innerSelectRef.current?.closest('form');
      if (form) {
        const handleReset = () => {
          setTimeout(() => {
            if (innerSelectRef.current) {
              setSelectedValue(innerSelectRef.current.value);
            }
          }, 0);
        };
        form.addEventListener('reset', handleReset);
        return () => form.removeEventListener('reset', handleReset);
      }
    }, []);

    // Sync if RHF programmatically sets value
    useEffect(() => {
      const interval = setInterval(() => {
        if (innerSelectRef.current && innerSelectRef.current.value !== selectedValue) {
          setSelectedValue(innerSelectRef.current.value);
        }
      }, 100);
      return () => clearInterval(interval);
    }, [selectedValue]);

    const handleSelect = (val: string) => {
      setSelectedValue(val);
      setIsOpen(false);
      
      if (innerSelectRef.current) {
        innerSelectRef.current.value = val;
        const event = new Event('change', { bubbles: true });
        innerSelectRef.current.dispatchEvent(event);
        
        if (onChange) {
           onChange({
             target: innerSelectRef.current,
             currentTarget: innerSelectRef.current,
           } as unknown as React.ChangeEvent<HTMLSelectElement>);
        }
      }
    };

    const selectedOption = options.find((opt) => {
      const v = typeof opt === "string" ? opt : opt.value;
      return v === selectedValue;
    });
    
    const displayLabel = selectedOption 
      ? (typeof selectedOption === "string" ? selectedOption : selectedOption.label)
      : (placeholder || "");

    return (
      <div className="flex flex-col gap-1.5" ref={containerRef}>
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-surface-300">
            {label}
          </label>
        )}
        
        <div className="relative">
          {/* Hidden native select for form integration */}
          <select
            ref={setRefs}
            id={id}
            className="hidden"
            value={selectedValue}
            onChange={(e) => {
              setSelectedValue(e.target.value);
              if (onChange) onChange(e);
            }}
            {...props}
          >
            {placeholder && <option value="" disabled>{placeholder}</option>}
            {options.map((opt) => {
              const value = typeof opt === "string" ? opt : opt.value;
              const labelStr = typeof opt === "string" ? opt : opt.label;
              return <option key={value} value={value}>{labelStr}</option>;
            })}
          </select>

          {/* Custom Trigger */}
          <div
            onClick={() => setIsOpen(!isOpen)}
            className={`input-base cursor-pointer flex items-center justify-between ${
              error ? "border-accent-crimson/50 focus:border-accent-crimson focus:shadow-[0_0_0_3px_rgba(220,38,38,0.15)]" : ""
            } ${className} ${isOpen ? 'border-primary-500 shadow-[0_0_0_3px_rgba(99,102,241,0.15)]' : ''}`}
          >
            <span className={!selectedValue ? "text-surface-500" : "text-surface-100"}>
              {displayLabel}
            </span>
            <ChevronDown size={16} className={`text-surface-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </div>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute z-50 w-full mt-2 bg-slate-800 border border-slate-700 shadow-xl rounded-md overflow-hidden animate-fade-in max-h-60 overflow-y-auto">
              <ul className="py-1 m-0 list-none pl-0">
                {options.map((opt) => {
                  const value = typeof opt === "string" ? opt : opt.value;
                  const labelStr = typeof opt === "string" ? opt : opt.label;
                  const isSelected = value === selectedValue;
                  
                  return (
                    <li
                      key={value}
                      onClick={() => handleSelect(value)}
                      className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${
                        isSelected 
                          ? 'bg-primary-500/20 text-primary-300 font-medium' 
                          : 'text-surface-200 hover:bg-surface-700/50 hover:text-white'
                      }`}
                    >
                      {labelStr}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
        
        {error && (
          <p className="text-xs text-accent-crimson mt-0.5">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
