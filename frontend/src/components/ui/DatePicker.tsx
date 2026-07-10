import React, { forwardRef, InputHTMLAttributes, useState, useRef, useEffect } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

interface DatePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  error?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  ({ label, error, id, className = "", onChange, value: propValue, defaultValue, ...props }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    
    // Internal state to hold the formatted date string "YYYY-MM-DD"
    const [selectedValue, setSelectedValue] = useState<string>(
      (propValue as string) || (defaultValue as string) || ""
    );

    const containerRef = useRef<HTMLDivElement>(null);
    const hiddenInputRef = useRef<HTMLInputElement | null>(null);

    // Merge refs
    const setRefs = (node: HTMLInputElement) => {
      hiddenInputRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref && 'current' in ref) {
        (ref as React.MutableRefObject<HTMLInputElement>).current = node;
      }
    };

    // Close on click outside
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
      const form = hiddenInputRef.current?.closest('form');
      if (form) {
        const handleReset = () => {
          setTimeout(() => {
            if (hiddenInputRef.current) {
              setSelectedValue(hiddenInputRef.current.value);
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
        if (hiddenInputRef.current && hiddenInputRef.current.value !== selectedValue) {
          setSelectedValue(hiddenInputRef.current.value);
        }
      }, 100);
      return () => clearInterval(interval);
    }, [selectedValue]);

    // Calendar logic
    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const padding = Array.from({ length: firstDay }, (_, i) => i);

    const handlePrevMonth = (e: React.MouseEvent) => {
      e.stopPropagation();
      setCurrentMonth(new Date(year, month - 1, 1));
    };

    const handleNextMonth = (e: React.MouseEvent) => {
      e.stopPropagation();
      setCurrentMonth(new Date(year, month + 1, 1));
    };

    const handleDateSelect = (day: number) => {
      // Format to YYYY-MM-DD
      const yyyy = year;
      const mm = String(month + 1).padStart(2, '0');
      const dd = String(day).padStart(2, '0');
      const formatted = `${yyyy}-${mm}-${dd}`;
      
      setSelectedValue(formatted);
      setIsOpen(false);

      if (hiddenInputRef.current) {
        hiddenInputRef.current.value = formatted;
        const event = new Event('change', { bubbles: true });
        hiddenInputRef.current.dispatchEvent(event);
        if (onChange) {
          onChange({
            target: hiddenInputRef.current,
            currentTarget: hiddenInputRef.current,
          } as unknown as React.ChangeEvent<HTMLInputElement>);
        }
      }
    };

    // Format for display
    const displayValue = selectedValue 
      ? new Date(selectedValue + 'T00:00:00').toLocaleDateString(undefined, { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })
      : "";

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return (
      <div className="flex flex-col gap-1.5" ref={containerRef}>
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-surface-300">
            {label}
          </label>
        )}
        
        <div className="relative">
          {/* Hidden native date input for form integration */}
          <input
            type="date"
            ref={setRefs}
            id={id}
            className="hidden"
            value={selectedValue}
            onChange={(e) => {
              setSelectedValue(e.target.value);
              if (onChange) onChange(e);
            }}
            {...props}
          />

          {/* Custom Trigger */}
          <div
            onClick={() => setIsOpen(!isOpen)}
            className={`input-base cursor-pointer flex items-center justify-between group ${
              error ? "border-accent-crimson/50 focus:border-accent-crimson focus:shadow-[0_0_0_3px_rgba(220,38,38,0.15)]" : ""
            } ${className} ${isOpen ? 'border-primary-500 shadow-[0_0_0_3px_rgba(99,102,241,0.15)]' : ''}`}
          >
            <span className={!selectedValue ? "text-surface-500" : "text-surface-100"}>
              {displayValue || props.placeholder || "Select date"}
            </span>
            <div className="p-1 rounded-md transition-colors group-hover:bg-primary-500/20 group-hover:text-primary-400">
              <CalendarIcon size={16} className={`text-surface-400 transition-colors group-hover:text-primary-400 ${isOpen ? 'text-primary-500' : ''}`} />
            </div>
          </div>

          {/* Custom Calendar Dropdown */}
          {isOpen && (
            <div className="absolute z-50 w-full md:w-64 bottom-full mb-2 p-3 bg-slate-800 border border-slate-700 shadow-xl rounded-md animate-fade-in">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <button 
                  type="button" 
                  onClick={handlePrevMonth}
                  className="p-1 rounded-md hover:bg-slate-700 text-surface-300 hover:text-white transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <div className="text-sm font-semibold text-white">
                  {monthNames[month]} {year}
                </div>
                <button 
                  type="button" 
                  onClick={handleNextMonth}
                  className="p-1 rounded-md hover:bg-slate-700 text-surface-300 hover:text-white transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Days Header */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                  <div key={day} className="text-center text-xs font-medium text-surface-400">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {padding.map(p => (
                  <div key={`empty-${p}`} className="h-8 w-8" />
                ))}
                {days.map(day => {
                  const isSelected = selectedValue === `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                  const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
                  
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDateSelect(day);
                      }}
                      className={`h-8 w-full flex items-center justify-center text-sm rounded-md transition-colors ${
                        isSelected 
                          ? 'bg-primary-500 text-white font-medium'
                          : isToday
                            ? 'bg-slate-700 text-primary-300 font-medium hover:bg-slate-600'
                            : 'text-surface-200 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
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

DatePicker.displayName = "DatePicker";

export default DatePicker;
