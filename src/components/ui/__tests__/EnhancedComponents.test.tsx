import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FormInput, FormTextarea, FormSelect, FormCheckbox, FormRadioGroup } from '../FormComponents';
import EnhancedButton from '../EnhancedButton';

// Mock framer-motion for testing
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('Enhanced UI Components', () => {
  describe('Form Components', () => {
    describe('FormInput', () => {
      it('renders with default props', () => {
        render(<FormInput label="Test Input" />);
        expect(screen.getByRole('textbox')).toBeInTheDocument();
        expect(screen.getByText('Test Input')).toBeInTheDocument();
      });

      it('renders with error state', () => {
        render(<FormInput label="Test Input" error="This field is required" />);
        expect(screen.getByText('This field is required')).toBeInTheDocument();
      });

      it('renders with helper text', () => {
        render(<FormInput label="Test Input" helperText="This is helper text" />);
        expect(screen.getByText('This is helper text')).toBeInTheDocument();
      });

      it('applies correct classes for different variants', () => {
        const { container, rerender } = render(<FormInput label="Test Input" variant="outlined" />);
        // For outlined variant, we expect border classes on the input element
        const input = container.querySelector('input');
        expect(input).toHaveClass('border-gray-300');

        rerender(<FormInput label="Test Input" variant="filled" />);
        const filledInput = container.querySelector('input');
        expect(filledInput).toHaveClass('bg-gray-50');

        rerender(<FormInput label="Test Input" variant="standard" />);
        const standardInput = container.querySelector('input');
        expect(standardInput).toHaveClass('border-0');
      });
    });

    describe('FormTextarea', () => {
      it('renders with default props', () => {
        render(<FormTextarea label="Test Textarea" />);
        expect(screen.getByRole('textbox')).toBeInTheDocument();
        expect(screen.getByText('Test Textarea')).toBeInTheDocument();
      });

      it('renders with error state', () => {
        render(<FormTextarea label="Test Textarea" error="This field is required" />);
        expect(screen.getByText('This field is required')).toBeInTheDocument();
      });

      it('renders with helper text', () => {
        render(<FormTextarea label="Test Textarea" helperText="This is helper text" />);
        expect(screen.getByText('This is helper text')).toBeInTheDocument();
      });
    });

    describe('FormSelect', () => {
      const options = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
      ];

      it('renders with default props', () => {
        render(<FormSelect label="Test Select" options={options} />);
        expect(screen.getByRole('combobox')).toBeInTheDocument();
        expect(screen.getByText('Test Select')).toBeInTheDocument();
      });

      it('renders with error state', () => {
        render(<FormSelect label="Test Select" options={options} error="This field is required" />);
        expect(screen.getByText('This field is required')).toBeInTheDocument();
      });

      it('renders with helper text', () => {
        render(<FormSelect label="Test Select" options={options} helperText="This is helper text" />);
        expect(screen.getByText('This is helper text')).toBeInTheDocument();
      });

      it('renders all options', () => {
        render(<FormSelect label="Test Select" options={options} />);
        options.forEach(option => {
          expect(screen.getByText(option.label)).toBeInTheDocument();
        });
      });
    });

    describe('FormCheckbox', () => {
      it('renders with default props', () => {
        render(<FormCheckbox label="Test Checkbox" />);
        expect(screen.getByRole('checkbox')).toBeInTheDocument();
        expect(screen.getByText('Test Checkbox')).toBeInTheDocument();
      });

      it('renders with error state', () => {
        render(<FormCheckbox label="Test Checkbox" error="This field is required" />);
        expect(screen.getByText('This field is required')).toBeInTheDocument();
      });

      it('renders with helper text', () => {
        render(<FormCheckbox label="Test Checkbox" helperText="This is helper text" />);
        expect(screen.getByText('This is helper text')).toBeInTheDocument();
      });
    });

    describe('FormRadioGroup', () => {
      const options = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
      ];

      it('renders with default props', () => {
        render(<FormRadioGroup label="Test Radio Group" name="test" options={options} />);
        expect(screen.getByText('Test Radio Group')).toBeInTheDocument();
        options.forEach(option => {
          expect(screen.getByLabelText(option.label)).toBeInTheDocument();
        });
      });

      it('renders with error state', () => {
        render(<FormRadioGroup label="Test Radio Group" name="test" options={options} error="This field is required" />);
        expect(screen.getByText('This field is required')).toBeInTheDocument();
      });

      it('renders with helper text', () => {
        render(<FormRadioGroup label="Test Radio Group" name="test" options={options} helperText="This is helper text" />);
        expect(screen.getByText('This is helper text')).toBeInTheDocument();
      });

      it('renders all options', () => {
        render(<FormRadioGroup label="Test Radio Group" name="test" options={options} />);
        options.forEach(option => {
          expect(screen.getByLabelText(option.label)).toBeInTheDocument();
        });
      });
    });
  });

  describe('EnhancedButton', () => {
    it('renders with default props', () => {
      render(<EnhancedButton>Click me</EnhancedButton>);
      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('renders with different variants', () => {
      render(
        <>
          <EnhancedButton variant="primary">Primary</EnhancedButton>
          <EnhancedButton variant="secondary">Secondary</EnhancedButton>
          <EnhancedButton variant="outline">Outline</EnhancedButton>
          <EnhancedButton variant="ghost">Ghost</EnhancedButton>
        </>
      );
      
      expect(screen.getByText('Primary')).toBeInTheDocument();
      expect(screen.getByText('Secondary')).toBeInTheDocument();
      expect(screen.getByText('Outline')).toBeInTheDocument();
      expect(screen.getByText('Ghost')).toBeInTheDocument();
    });

    it('renders with different sizes', () => {
      render(
        <>
          <EnhancedButton size="xs">XS</EnhancedButton>
          <EnhancedButton size="sm">SM</EnhancedButton>
          <EnhancedButton size="md">MD</EnhancedButton>
          <EnhancedButton size="lg">LG</EnhancedButton>
          <EnhancedButton size="xl">XL</EnhancedButton>
        </>
      );
      
      expect(screen.getByText('XS')).toBeInTheDocument();
      expect(screen.getByText('SM')).toBeInTheDocument();
      expect(screen.getByText('MD')).toBeInTheDocument();
      expect(screen.getByText('LG')).toBeInTheDocument();
      expect(screen.getByText('XL')).toBeInTheDocument();
    });

    it('shows loading state when isLoading is true', () => {
      render(<EnhancedButton isLoading>Loading</EnhancedButton>);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('is disabled when disabled prop is true', () => {
      render(<EnhancedButton disabled>Disabled</EnhancedButton>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('calls onClick handler when clicked', () => {
      const handleClick = jest.fn();
      render(<EnhancedButton onClick={handleClick}>Click me</EnhancedButton>);
      fireEvent.click(screen.getByText('Click me'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });
});