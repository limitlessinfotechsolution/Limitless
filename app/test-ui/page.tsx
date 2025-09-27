'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import CardEnhanced from '@/components/ui/Card-enhanced';
import './globals.css';

export default function TestUIPage() {
  return (
    <div className="container-custom py-12">
      <h1 className="heading-xl mb-8">UI Component Test</h1>
      
      <div className="test-highlight">
        CSS Import Test - If you see this styled box, CSS imports are working!
      </div>
      
      <div className="grid-responsive mb-12">
        <CardEnhanced variant="elevated" className="flex flex-col items-center">
          <h2 className="heading-md mb-4">Button Variants</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="gradient">Gradient</Button>
          </div>
        </CardEnhanced>

        <CardEnhanced variant="outlined" className="flex flex-col items-center">
          <h2 className="heading-md mb-4">Button Sizes</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
        </CardEnhanced>

        <CardEnhanced variant="glass" className="flex flex-col items-center">
          <h2 className="heading-md mb-4">Card Variants</h2>
          <div className="space-y-4">
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
              Default Card
            </div>
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              Elevated Card
            </div>
          </div>
        </CardEnhanced>
      </div>

      <CardEnhanced variant="elevated" className="mb-8">
        <h2 className="heading-lg mb-4">Typography</h2>
        <div className="space-y-2">
          <h1 className="heading-xl">Heading XL</h1>
          <h2 className="heading-lg">Heading LG</h2>
          <h3 className="heading-md">Heading MD</h3>
          <h4 className="heading-sm">Heading SM</h4>
          <p className="body-lg">Large body text with <span className="font-semibold">bold</span> elements.</p>
          <p className="body-md">Medium body text with <span className="text-accent">colored</span> elements.</p>
          <p className="body-sm">Small body text with <span className="underline">underlined</span> elements.</p>
        </div>
      </CardEnhanced>
      
      <div className="test-card">
        <h3 className="heading-md mb-4">Custom CSS Test</h3>
        <p className="mb-4">This card uses custom CSS classes to verify that CSS imports are working correctly.</p>
        <button className="test-button">Custom CSS Button</button>
      </div>
    </div>
  );
}