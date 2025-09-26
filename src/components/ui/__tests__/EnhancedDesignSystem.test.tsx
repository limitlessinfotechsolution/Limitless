import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { 
  Heading, 
  Paragraph, 
  Text, 
  List, 
  ListItem 
} from '../EnhancedTypography';
import { 
  ColorSwatch, 
  GradientSwatch 
} from '../EnhancedColorScheme';
import { 
  ResponsiveContainer, 
  ResponsiveGrid, 
  ResponsiveFlex, 
  ResponsiveSpacing, 
  ResponsiveCard 
} from '../EnhancedResponsive';

// Mock framer-motion for testing
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('Enhanced Design System Components', () => {
  describe('EnhancedTypography', () => {
    describe('Heading', () => {
      it('renders heading level 1 with default props', () => {
        render(<Heading level={1}>Test Heading</Heading>);
        const heading = screen.getByRole('heading', { level: 1 });
        expect(heading).toBeInTheDocument();
        expect(heading).toHaveTextContent('Test Heading');
      });

      it('renders heading with different levels', () => {
        render(
          <>
            <Heading level={1}>H1</Heading>
            <Heading level={2}>H2</Heading>
            <Heading level={3}>H3</Heading>
          </>
        );
        
        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('H1');
        expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('H2');
        expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('H3');
      });

      it('applies gradient class when gradient prop is true', () => {
        render(<Heading gradient>Gradient Heading</Heading>);
        const heading = screen.getByRole('heading');
        expect(heading).toHaveClass('bg-gradient-to-r');
      });
    });

    describe('Paragraph', () => {
      it('renders paragraph with default props', () => {
        render(<Paragraph>Test paragraph content</Paragraph>);
        expect(screen.getByText('Test paragraph content')).toBeInTheDocument();
      });

      it('applies lead class when lead prop is true', () => {
        render(<Paragraph lead>Lead paragraph</Paragraph>);
        const paragraph = screen.getByText('Lead paragraph');
        expect(paragraph).toHaveClass('leading-relaxed');
      });
    });

    describe('Text', () => {
      it('renders inline text with default props', () => {
        render(<Text>Inline text</Text>);
        expect(screen.getByText('Inline text')).toBeInTheDocument();
      });

      it('applies styling classes correctly', () => {
        render(<Text italic underline strikethrough>Styled text</Text>);
        const text = screen.getByText('Styled text');
        expect(text).toHaveClass('italic');
        expect(text).toHaveClass('underline');
        expect(text).toHaveClass('line-through');
      });
    });

    describe('List', () => {
      it('renders unordered list by default', () => {
        render(
          <List>
            <ListItem>Item 1</ListItem>
            <ListItem>Item 2</ListItem>
          </List>
        );
        
        const list = screen.getByRole('list');
        expect(list).toBeInTheDocument();
        expect(list.tagName).toBe('UL');
      });

      it('renders ordered list when type is ol', () => {
        render(
          <List type="ol">
            <ListItem>Item 1</ListItem>
            <ListItem>Item 2</ListItem>
          </List>
        );
        
        const list = screen.getByRole('list');
        expect(list.tagName).toBe('OL');
      });
    });
  });

  describe('EnhancedColorScheme', () => {
    describe('ColorSwatch', () => {
      it('renders color swatch with correct properties', () => {
        render(
          <ColorSwatch 
            color="#D4AF37" 
            name="Gold" 
            hex="#D4AF37" 
            textColor="text-gray-900" 
          />
        );
        
        expect(screen.getByText('Gold')).toBeInTheDocument();
        expect(screen.getByText('#D4AF37')).toBeInTheDocument();
      });
    });

    describe('GradientSwatch', () => {
      it('renders gradient swatch with correct properties', () => {
        render(
          <GradientSwatch 
            gradient="linear-gradient(135deg, #D4AF37 0%, #FF6B35 100%)" 
            name="Gold Gradient" 
          />
        );
        
        expect(screen.getByText('Gold Gradient')).toBeInTheDocument();
      });
    });
  });

  describe('EnhancedResponsive', () => {
    describe('ResponsiveContainer', () => {
      it('renders container with default props', () => {
        render(<ResponsiveContainer>Container content</ResponsiveContainer>);
        expect(screen.getByText('Container content')).toBeInTheDocument();
      });

      it('applies fluid class when fluid prop is true', () => {
        render(<ResponsiveContainer fluid>Fluid container</ResponsiveContainer>);
        const container = screen.getByText('Fluid container').parentElement;
        expect(container).not.toHaveClass('max-w-7xl');
      });
    });

    describe('ResponsiveGrid', () => {
      it('renders grid with default configuration', () => {
        render(
          <ResponsiveGrid>
            <div>Grid item</div>
          </ResponsiveGrid>
        );
        
        const grid = screen.getByText('Grid item').parentElement;
        expect(grid).toHaveClass('grid');
        expect(grid).toHaveClass('grid-cols-1');
      });
    });

    describe('ResponsiveFlex', () => {
      it('renders flex container with default props', () => {
        render(
          <ResponsiveFlex>
            <div>Flex item</div>
          </ResponsiveFlex>
        );
        
        const flex = screen.getByText('Flex item').parentElement;
        expect(flex).toHaveClass('flex');
        expect(flex).toHaveClass('flex-row');
      });
    });

    describe('ResponsiveSpacing', () => {
      it('renders spacing element with default props', () => {
        const { container } = render(<ResponsiveSpacing />);
        const spacing = container.firstChild;
        expect(spacing).toHaveClass('py-6');
      });
    });

    describe('ResponsiveCard', () => {
      it('renders card with default props', () => {
        render(<ResponsiveCard>Card content</ResponsiveCard>);
        const card = screen.getByText('Card content').closest('.bg-white, .dark\\:bg-gray-800');
        expect(card).toBeInTheDocument();
      });

      it('applies variant classes correctly', () => {
        render(<ResponsiveCard variant="outlined">Outlined card</ResponsiveCard>);
        const card = screen.getByText('Outlined card').closest('.border');
        expect(card).toBeInTheDocument();
        expect(card).toHaveClass('bg-transparent');
      });
    });
  });
});