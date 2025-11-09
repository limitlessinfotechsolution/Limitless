import React from 'react';
import { 
  AdaptiveContainer, 
  AdaptiveGrid, 
  AdaptiveFlex, 
  AdaptiveSpacing, 
  AdaptiveText 
} from './AdaptiveContainer';
import { useResponsive, useTouchFriendly } from '../../hooks/ui/useResponsive';
import Card from './Card';

const ResponsiveDemo: React.FC = () => {
  const { 
    device, 
    isMobile, 
    isTablet, 
    isDesktop, 
    isLargeDesktop,
    orientation,
    isTouchDevice
  } = useResponsive();
  
  const { touchTargetClasses, touchPaddingClasses, touchHoverClasses } = useTouchFriendly();

  return (
    <AdaptiveContainer className="py-8">
      <AdaptiveSpacing padding="lg" margin="md">
        <AdaptiveText 
          size="3xl" 
          weight="bold" 
          align="center"
          className="mb-8"
        >
          Responsive Design Demo
        </AdaptiveText>
        
        <AdaptiveGrid cols={{ xs: 1, sm: 2, md: 3, lg: 4 }} gap="lg">
          <Card className="p-6">
            <AdaptiveText size="xl" weight="semibold" className="mb-2">
              Device Info
            </AdaptiveText>
            <AdaptiveText size="sm" className="text-gray-600 dark:text-gray-400">
              Type: {device}
            </AdaptiveText>
            <AdaptiveText size="sm" className="text-gray-600 dark:text-gray-400">
              Orientation: {orientation}
            </AdaptiveText>
            <AdaptiveText size="sm" className="text-gray-600 dark:text-gray-400">
              Touch Support: {isTouchDevice ? 'Yes' : 'No'}
            </AdaptiveText>
          </Card>
          
          <Card className="p-6">
            <AdaptiveText size="xl" weight="semibold" className="mb-2">
              Screen Sizes
            </AdaptiveText>
            <AdaptiveText size="sm" className="text-gray-600 dark:text-gray-400">
              Mobile: {isMobile ? '✓' : '✗'}
            </AdaptiveText>
            <AdaptiveText size="sm" className="text-gray-600 dark:text-gray-400">
              Tablet: {isTablet ? '✓' : '✗'}
            </AdaptiveText>
            <AdaptiveText size="sm" className="text-gray-600 dark:text-gray-400">
              Desktop: {isDesktop ? '✓' : '✗'}
            </AdaptiveText>
            <AdaptiveText size="sm" className="text-gray-600 dark:text-gray-400">
              Large Desktop: {isLargeDesktop ? '✓' : '✗'}
            </AdaptiveText>
          </Card>
          
          <Card className="p-6">
            <AdaptiveText size="xl" weight="semibold" className="mb-2">
              Touch Optimization
            </AdaptiveText>
            <AdaptiveText size="sm" className="text-gray-600 dark:text-gray-400">
              Touch Target: {touchTargetClasses ? 'Applied' : 'Not Applied'}
            </AdaptiveText>
            <AdaptiveText size="sm" className="text-gray-600 dark:text-gray-400">
              Touch Padding: {touchPaddingClasses ? 'Applied' : 'Not Applied'}
            </AdaptiveText>
            <AdaptiveText size="sm" className="text-gray-600 dark:text-gray-400">
              Touch Hover: {touchHoverClasses ? 'Applied' : 'Not Applied'}
            </AdaptiveText>
          </Card>
          
          <Card className="p-6">
            <AdaptiveText size="xl" weight="semibold" className="mb-2">
              Adaptive Grid
            </AdaptiveText>
            <AdaptiveText size="sm" className="text-gray-600 dark:text-gray-400">
              Columns adjust based on screen size
            </AdaptiveText>
            <AdaptiveText size="sm" className="text-gray-600 dark:text-gray-400">
              Gap spacing is responsive
            </AdaptiveText>
          </Card>
        </AdaptiveGrid>
        
        <AdaptiveSpacing padding="lg">
          <Card className="p-6">
            <AdaptiveText size="xl" weight="semibold" className="mb-4">
              Interactive Demo
            </AdaptiveText>
            
            <AdaptiveFlex 
              direction="col" 
              md-direction="row" 
              gap="md" 
              wrap="wrap"
              className="mb-6"
            >
              <button 
                className={`${touchTargetClasses} ${touchPaddingClasses} ${touchHoverClasses} bg-accent text-white rounded-lg px-4 py-2`}
              >
                Touch-Friendly Button
              </button>
              
              <button 
                className={`${touchTargetClasses} ${touchPaddingClasses} ${touchHoverClasses} border border-accent text-accent rounded-lg px-4 py-2`}
              >
                Secondary Button
              </button>
            </AdaptiveFlex>
            
            <AdaptiveGrid cols={{ xs: 1, sm: 2, lg: 3 }} gap="md">
              {[1, 2, 3].map((item) => (
                <Card key={item} className={`${touchTargetClasses} p-4`}>
                  <AdaptiveText size="lg" weight="semibold">
                    Card {item}
                  </AdaptiveText>
                  <AdaptiveText size="sm" className="text-gray-600 dark:text-gray-400">
                    This card adapts to screen size
                  </AdaptiveText>
                </Card>
              ))}
            </AdaptiveGrid>
          </Card>
        </AdaptiveSpacing>
        
        <AdaptiveSpacing padding="lg">
          <Card className="p-6">
            <AdaptiveText size="xl" weight="semibold" className="mb-4">
              Typography Demo
            </AdaptiveText>
            
            <AdaptiveText 
              size="4xl" 
              weight="bold" 
              responsiveSize={{ xs: '2xl', sm: '3xl', md: '4xl' }}
              className="mb-2"
            >
              Responsive Heading
            </AdaptiveText>
            
            <AdaptiveText 
              size="base" 
              responsiveSize={{ xs: 'sm', sm: 'base', lg: 'lg' }}
              className="text-gray-600 dark:text-gray-400"
            >
              This text adapts its size based on the screen dimensions. On mobile devices, 
              it will be smaller, and on larger screens, it will be larger for better readability.
            </AdaptiveText>
          </Card>
        </AdaptiveSpacing>
      </AdaptiveSpacing>
    </AdaptiveContainer>
  );
};

export default ResponsiveDemo;