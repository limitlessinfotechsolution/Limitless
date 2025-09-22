'use client';

import React, { useState } from 'react';
import { Share2, Copy, Check, Twitter, Facebook, Linkedin } from 'lucide-react';

interface SocialShareProps {
  testimonial: {
    id: string;
    name: string;
    company: string;
    content: string;
    rating: number;
  };
  className?: string;
}

const SocialShare: React.FC<SocialShareProps> = ({ testimonial, className = '' }) => {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Generate shareable URL for the testimonial
  const testimonialUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/testimonials?testimonial=${testimonial.id}`
    : '';

  // Generate share text
  const shareText = `Check out this testimonial from ${testimonial.name} at ${testimonial.company}: "${testimonial.content}"`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(testimonialUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(testimonialUrl)}`;
    window.open(url, '_blank');
  };

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(testimonialUrl)}`;
    window.open(url, '_blank');
  };

  const shareToLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(testimonialUrl)}`;
    window.open(url, '_blank');
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 text-gray-500 hover:text-accent transition-colors"
        aria-label="Share testimonial"
      >
        <Share2 className="w-4 h-4" />
        <span className="text-sm">Share</span>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute bottom-full right-0 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 z-50 w-64">
            <div className="flex items-center space-x-2 mb-3">
              <input
                type="text"
                value={testimonialUrl}
                readOnly
                className="flex-1 text-xs p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              />
              <button
                onClick={copyToClipboard}
                className="p-2 text-gray-500 hover:text-accent"
                aria-label={copied ? "Copied" : "Copy link"}
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            
            <div className="flex space-x-3 justify-center pt-2 border-t dark:border-gray-700">
              <button
                onClick={shareToTwitter}
                className="p-2 text-gray-500 hover:text-blue-400 transition-colors"
                aria-label="Share on Twitter"
              >
                <Twitter className="w-5 h-5" />
              </button>
              <button
                onClick={shareToFacebook}
                className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                aria-label="Share on Facebook"
              >
                <Facebook className="w-5 h-5" />
              </button>
              <button
                onClick={shareToLinkedIn}
                className="p-2 text-gray-500 hover:text-blue-700 transition-colors"
                aria-label="Share on LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SocialShare;