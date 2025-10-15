import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { ThemeProvider } from '../../common/ThemeProvider';
import { useThemeContext } from '../../common/useThemeContext';

// Test component that uses the theme context
const TestComponent: React.FC = () => {
  const { theme, setTheme } = useThemeContext();
  
  return (
    <div>
      <span data-testid="theme-value">{theme}</span>
      <button onClick={() => setTheme('dark')} data-testid="set-dark-theme">
        Set Dark Theme
      </button>
    </div>
  );
};

describe('ThemeProvider', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();

    // Mock window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  it('provides default theme context', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-value')).toBeInTheDocument();
  });

  it('allows theme to be changed', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const themeValue = screen.getByTestId('theme-value');
    const setDarkButton = screen.getByTestId('set-dark-theme');

    // Initially should be system theme
    expect(themeValue.textContent).toBe('system');

    // Click to change theme
    act(() => {
      setDarkButton.click();
    });

    // Theme should be updated
    expect(themeValue.textContent).toBe('dark');
  });
});