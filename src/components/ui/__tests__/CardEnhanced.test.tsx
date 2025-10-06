import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CardEnhanced from '../CardEnhanced';

describe('CardEnhanced', () => {
  const defaultProps = {
    children: <div>Test Content</div>,
  };

  it('renders children correctly', () => {
    render(<CardEnhanced {...defaultProps} />);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies default variant classes', () => {
    const { container } = render(<CardEnhanced {...defaultProps} />);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('bg-white', 'dark:bg-gray-800', 'rounded-2xl', 'shadow-lg');
  });

  it('applies elevated variant classes', () => {
    const { container } = render(<CardEnhanced {...defaultProps} variant="elevated" />);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('shadow-2xl', 'hover:shadow-3xl', 'transform', 'hover:-translate-y-1');
  });

  it('applies outlined variant classes', () => {
    const { container } = render(<CardEnhanced {...defaultProps} variant="outlined" />);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('bg-transparent', 'border-2', 'border-gray-200', 'dark:border-gray-600');
  });

  it('applies hover lift effect', () => {
    const { container } = render(<CardEnhanced {...defaultProps} hover="lift" />);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('hover:transform', 'hover:-translate-y-2', 'hover:shadow-2xl');
  });

  it('applies hover glow effect', () => {
    const { container } = render(<CardEnhanced {...defaultProps} hover="glow" />);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('hover:shadow-2xl', 'hover:shadow-accent/25');
  });

  it('applies custom className', () => {
    const { container } = render(<CardEnhanced {...defaultProps} className="custom-class" />);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('custom-class');
  });

  it('passes through other props', () => {
    const { container } = render(<CardEnhanced {...defaultProps} data-testid="test-card" />);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveAttribute('data-testid', 'test-card');
  });

  it('handles onClick prop', () => {
    const mockOnClick = jest.fn();
    render(<CardEnhanced {...defaultProps} onClick={mockOnClick} />);
    const card = screen.getByText('Test Content');
    card.click();
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});
