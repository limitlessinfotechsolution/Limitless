import React, { forwardRef } from 'react';

// Enhanced Form Input Component
interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  variant?: 'standard' | 'filled' | 'outlined';
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ 
    label, 
    error, 
    helperText, 
    icon, 
    className = '', 
    fullWidth = true,
    variant = 'outlined',
    ...props 
  }, ref) => {
    const baseClasses = 'w-full transition-all duration-200 focus:outline-none focus:ring-2';
    
    const variantClasses = {
      standard: 'border-0 border-b-2 rounded-none px-0',
      filled: 'bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg',
      outlined: 'border border-gray-300 dark:border-gray-600 rounded-lg'
    };
    
    const focusClasses = 'focus:ring-accent focus:border-transparent';
    const errorClasses = error 
      ? 'border-red-500 dark:border-red-400 focus:ring-red-500' 
      : 'focus:ring-accent focus:border-transparent hover:border-gray-400 dark:hover:border-gray-500';
    
    const paddingClasses = icon ? 'pl-10 pr-3 py-2.5' : 'px-3 py-2.5';
    const widthClass = fullWidth ? 'w-full' : '';
    
    const inputClasses = [
      baseClasses,
      variantClasses[variant],
      focusClasses,
      errorClasses,
      paddingClasses,
      widthClass,
      className
    ].filter(Boolean).join(' ');

    return (
      <div className={fullWidth ? 'w-full' : 'inline-block'}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={inputClasses}
            {...props}
          />
        </div>
        {(error || helperText) && (
          <p className={`mt-1 text-sm ${error ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';

// Enhanced Textarea Component
interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  variant?: 'standard' | 'filled' | 'outlined';
  rows?: number;
}

const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ 
    label, 
    error, 
    helperText, 
    className = '', 
    fullWidth = true,
    variant = 'outlined',
    rows = 4,
    ...props 
  }, ref) => {
    const baseClasses = 'w-full transition-all duration-200 focus:outline-none focus:ring-2 resize-none';
    
    const variantClasses = {
      standard: 'border-0 border-b-2 rounded-none px-0',
      filled: 'bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg',
      outlined: 'border border-gray-300 dark:border-gray-600 rounded-lg'
    };
    
    const focusClasses = 'focus:ring-accent focus:border-transparent';
    const errorClasses = error 
      ? 'border-red-500 dark:border-red-400 focus:ring-red-500' 
      : 'focus:ring-accent focus:border-transparent hover:border-gray-400 dark:hover:border-gray-500';
    
    const paddingClasses = 'px-3 py-2.5';
    const widthClass = fullWidth ? 'w-full' : '';
    
    const textareaClasses = [
      baseClasses,
      variantClasses[variant],
      focusClasses,
      errorClasses,
      paddingClasses,
      widthClass,
      className
    ].filter(Boolean).join(' ');

    return (
      <div className={fullWidth ? 'w-full' : 'inline-block'}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          <textarea
            ref={ref}
            rows={rows}
            className={textareaClasses}
            {...props}
          />
        </div>
        {(error || helperText) && (
          <p className={`mt-1 text-sm ${error ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

FormTextarea.displayName = 'FormTextarea';

// Enhanced Select Component
interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  variant?: 'standard' | 'filled' | 'outlined';
  options: Array<{ value: string; label: string; disabled?: boolean }>;
}

const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ 
    label, 
    error, 
    helperText, 
    icon, 
    className = '', 
    fullWidth = true,
    variant = 'outlined',
    options,
    ...props 
  }, ref) => {
    const baseClasses = 'w-full transition-all duration-200 focus:outline-none focus:ring-2 appearance-none';
    
    const variantClasses = {
      standard: 'border-0 border-b-2 rounded-none px-0',
      filled: 'bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg',
      outlined: 'border border-gray-300 dark:border-gray-600 rounded-lg'
    };
    
    const focusClasses = 'focus:ring-accent focus:border-transparent';
    const errorClasses = error 
      ? 'border-red-500 dark:border-red-400 focus:ring-red-500' 
      : 'focus:ring-accent focus:border-transparent hover:border-gray-400 dark:hover:border-gray-500';
    
    const paddingClasses = icon ? 'pl-10 pr-8 py-2.5' : 'px-3 py-2.5';
    const widthClass = fullWidth ? 'w-full' : '';
    
    const selectClasses = [
      baseClasses,
      variantClasses[variant],
      focusClasses,
      errorClasses,
      paddingClasses,
      widthClass,
      className
    ].filter(Boolean).join(' ');

    return (
      <div className={fullWidth ? 'w-full' : 'inline-block'}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
              {icon}
            </div>
          )}
          <select
            ref={ref}
            className={selectClasses}
            {...props}
          >
            {options.map((option) => (
              <option 
                key={option.value} 
                value={option.value} 
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-400 dark:text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
        {(error || helperText) && (
          <p className={`mt-1 text-sm ${error ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

FormSelect.displayName = 'FormSelect';

// Enhanced Checkbox Component
interface FormCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const FormCheckbox = forwardRef<HTMLInputElement, FormCheckboxProps>(
  ({ 
    label, 
    error, 
    helperText, 
    className = '', 
    ...props 
  }, ref) => {
    return (
      <div className="w-full">
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              ref={ref}
              type="checkbox"
              className={`w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent dark:focus:ring-accent dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 ${
                error ? 'border-red-500 dark:border-red-400' : ''
              } ${className}`}
              {...props}
            />
          </div>
          {label && (
            <label className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              {label}
            </label>
          )}
        </div>
        {(error || helperText) && (
          <p className={`mt-1 text-sm ${error ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

FormCheckbox.displayName = 'FormCheckbox';

// Enhanced Radio Group Component
interface FormRadioGroupProps {
  label?: string;
  error?: string;
  helperText?: string;
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  className?: string;
}

const FormRadioGroup: React.FC<FormRadioGroupProps> = ({ 
  label, 
  error, 
  helperText, 
  name,
  value,
  onChange,
  options,
  className = ''
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      <div className="space-y-2">
        {options.map((option) => (
          <div key={option.value} className="flex items-center">
            <input
              type="radio"
              id={`${name}-${option.value}`}
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange && onChange(option.value)}
              disabled={option.disabled}
              className={`w-4 h-4 text-accent border-gray-300 focus:ring-accent dark:focus:ring-accent dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 ${
                error ? 'border-red-500 dark:border-red-400' : ''
              }`}
            />
            <label 
              htmlFor={`${name}-${option.value}`} 
              className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
      {(error || helperText) && (
        <p className={`mt-1 text-sm ${error ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export { FormInput, FormTextarea, FormSelect, FormCheckbox, FormRadioGroup };