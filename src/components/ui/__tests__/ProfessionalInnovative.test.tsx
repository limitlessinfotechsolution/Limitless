import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProfessionalCard from '../ProfessionalCard';
import InnovativeBackground from '../InnovativeBackground';
import ProfessionalLoader from '../ProfessionalLoader';
import ProfessionalHero from '../../home/ProfessionalHero';
import InnovativeStats from '../../home/InnovativeStats';

// Mock framer-motion since it's not compatible with JSDOM
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => <div {...props}>{children}</div>,
    span: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => <span {...props}>{children}</span>,
    section: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => <section {...props}>{children}</section>,
    p: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => <p {...props}>{children}</p>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('../../config/uiConfig', () => ({
  UI_CONFIG: {
    colors: {
      primary: '#D4AF37',
      secondary: '#1A237E',
      accent: '#D4AF37',
      accentOrange: '#FF6B35',
      accentDark: '#B8860B',
      background: {
        light: '#FFFFFF',
        dark: '#0F172A',
      },
      text: {
        light: '#1F2937',
        dark: '#F9FAFB',
      },
      professional: {
        shadow: 'shadow-lg',
        border: 'border-gray-200 dark:border-gray-700',
      },
      innovative: {
        primary: '#6366f1',
        glow: 'shadow-indigo-500/25',
      },
    },
    animations: {
      duration: {
        fast: 200,
        normal: 300,
        slow: 500,
      },
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      professional: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
}));

describe('Professional & Innovative Components', () => {
  describe('ProfessionalCard', () => {
    it('renders with default props', () => {
      render(<ProfessionalCard>Test Content</ProfessionalCard>);
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('renders with different variants', () => {
      const { rerender } = render(<ProfessionalCard variant="default">Content</ProfessionalCard>);
      expect(screen.getByText('Content')).toBeInTheDocument();

      rerender(<ProfessionalCard variant="elevated">Content</ProfessionalCard>);
      expect(screen.getByText('Content')).toBeInTheDocument();

      rerender(<ProfessionalCard variant="glass">Content</ProfessionalCard>);
      expect(screen.getByText('Content')).toBeInTheDocument();

      rerender(<ProfessionalCard variant="innovative">Content</ProfessionalCard>);
      expect(screen.getByText('Content')).toBeInTheDocument();

      rerender(<ProfessionalCard variant="premium">Content</ProfessionalCard>);
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('renders with different sizes', () => {
      const { rerender } = render(<ProfessionalCard size="sm">Content</ProfessionalCard>);
      expect(screen.getByText('Content')).toBeInTheDocument();

      rerender(<ProfessionalCard size="md">Content</ProfessionalCard>);
      expect(screen.getByText('Content')).toBeInTheDocument();

      rerender(<ProfessionalCard size="lg">Content</ProfessionalCard>);
      expect(screen.getByText('Content')).toBeInTheDocument();

      rerender(<ProfessionalCard size="xl">Content</ProfessionalCard>);
      expect(screen.getByText('Content')).toBeInTheDocument();

      rerender(<ProfessionalCard size="2xl">Content</ProfessionalCard>);
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('renders with border glow when enabled', () => {
      render(<ProfessionalCard borderGlow={true}>Content</ProfessionalCard>);
      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });

  describe('InnovativeBackground', () => {
    it('renders with default props', () => {
      const { container } = render(<InnovativeBackground />);
      expect(container).toBeInTheDocument();
    });

    it('renders with different variants', () => {
      const { rerender } = render(<InnovativeBackground variant="particles" />);
      expect(rerender).not.toThrow();

      rerender(<InnovativeBackground variant="waves" />);
      expect(rerender).not.toThrow();

      rerender(<InnovativeBackground variant="geometric" />);
      expect(rerender).not.toThrow();

      rerender(<InnovativeBackground variant="gradient" />);
      expect(rerender).not.toThrow();

      rerender(<InnovativeBackground variant="aurora" />);
      expect(rerender).not.toThrow();
    });

    it('renders with different intensities', () => {
      const { rerender } = render(<InnovativeBackground intensity="low" />);
      expect(rerender).not.toThrow();

      rerender(<InnovativeBackground intensity="medium" />);
      expect(rerender).not.toThrow();

      rerender(<InnovativeBackground intensity="high" />);
      expect(rerender).not.toThrow();
    });

    it('renders with different speeds', () => {
      const { rerender } = render(<InnovativeBackground speed="slow" />);
      expect(rerender).not.toThrow();

      rerender(<InnovativeBackground speed="normal" />);
      expect(rerender).not.toThrow();

      rerender(<InnovativeBackground speed="fast" />);
      expect(rerender).not.toThrow();
    });
  });

  describe('ProfessionalLoader', () => {
    it('renders with default props', () => {
      render(<ProfessionalLoader />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('renders with different variants', () => {
      const { rerender } = render(<ProfessionalLoader variant="spinner" />);
      expect(screen.getByRole('status')).toBeInTheDocument();

      rerender(<ProfessionalLoader variant="dots" />);
      expect(screen.getByRole('status')).toBeInTheDocument();

      rerender(<ProfessionalLoader variant="bars" />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('renders with message', () => {
      render(<ProfessionalLoader message="Loading..." />);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  describe('ProfessionalHero', () => {
    const mockProps = {
      title: 'Professional Solutions',
      subtitle: 'Innovative Approach',
      description: 'Transform your business with our cutting-edge solutions',
      ctaText: 'Get Started',
      ctaLink: '/contact',
      secondaryCtaText: 'Learn More',
      secondaryCtaLink: '/services',
    };

    it('renders with all props', () => {
      render(<ProfessionalHero {...mockProps} />);
      expect(screen.getByText('Professional Solutions')).toBeInTheDocument();
      expect(screen.getByText('Innovative Approach')).toBeInTheDocument();
      expect(screen.getByText('Transform your business with our cutting-edge solutions')).toBeInTheDocument();
      expect(screen.getByText('Get Started')).toBeInTheDocument();
      expect(screen.getByText('Learn More')).toBeInTheDocument();
    });

    it('renders without secondary CTA', () => {
      const propsWithoutSecondary = { 
        ...mockProps,
        secondaryCtaText: undefined,
        secondaryCtaLink: undefined
      };

      render(<ProfessionalHero {...propsWithoutSecondary} />);
      expect(screen.getByText('Professional Solutions')).toBeInTheDocument();
      expect(screen.getByText('Get Started')).toBeInTheDocument();
      expect(screen.queryByText('Learn More')).not.toBeInTheDocument();
    });
  });

  describe('InnovativeStats', () => {
    const mockStats = [
      {
        number: '100+',
        label: 'Projects',
        description: 'Successfully delivered',
      },
      {
        number: '50+',
        label: 'Clients',
        description: 'Satisfied customers',
      },
    ];

    it('renders with stats', () => {
      render(<InnovativeStats stats={mockStats} />);
      expect(screen.getByText('100+')).toBeInTheDocument();
      expect(screen.getByText('Projects')).toBeInTheDocument();
      expect(screen.getByText('Successfully delivered')).toBeInTheDocument();
      expect(screen.getByText('50+')).toBeInTheDocument();
      expect(screen.getByText('Clients')).toBeInTheDocument();
      expect(screen.getByText('Satisfied customers')).toBeInTheDocument();
    });

    it('renders with title and subtitle', () => {
      render(
        <InnovativeStats 
          stats={mockStats} 
          title="Our Achievements" 
          subtitle="Key metrics that define our success"
        />
      );
      expect(screen.getByText('Our Achievements')).toBeInTheDocument();
      expect(screen.getByText('Key metrics that define our success')).toBeInTheDocument();
    });
  });
});