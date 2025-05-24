'use client';
import { useEffect, useState } from 'react';
import { debounce } from '@/shared/utils/debounce';
import { ScreenLayout } from '@/constants/common';

const breakpoints: Record<ScreenLayout, string> = {
  mobile: '(max-width: 767px)', // Up to 767px wide (typical phone portrait)
  tablet: '(min-width: 768px) and (max-width: 1023px)', // 768px to 1023px (typical tablet portrait)
  desktop: '(min-width: 1024px)', // 1024px and up (typical desktop)
};

export const useQueryMedia = () => {
  const [currentLayout, setCurrentLayout] = useState<ScreenLayout>(
    ScreenLayout.Mobile
  );

  useEffect(() => {
    const getScreenLayout = (): ScreenLayout => {
      for (const layout in breakpoints) {
        const mediaQueryString = breakpoints[layout as ScreenLayout];
        if (window.matchMedia(mediaQueryString).matches) {
          return layout as ScreenLayout;
        }
      }
      return ScreenLayout.Mobile; // Default to mobile if no match
    };
    const handleChange = () => {
      // You can handle changes here if needed
      const newLayout = getScreenLayout();
      setCurrentLayout(newLayout);
    };
    handleChange();
    window.addEventListener('resize', debounce(handleChange, 500));

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener('resize', debounce(handleChange, 500));
    };
  }, []);

  return currentLayout;
};
