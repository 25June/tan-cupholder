'use client';
import { useEffect, useState } from 'react';
import { debounce } from '@/shared/utils/debounce';
import { ScreenLayout } from '@/constants/common';

const breakpoints: Record<ScreenLayout, (size: number) => boolean> = {
  mobile: (size: number) => size < 768, // Up to 767px wide (typical phone portrait)
  tablet: (size: number) => size > 768 && size < 1023, // 768px to 1023px (typical tablet portrait)
  desktop: (size: number) => size > 1024, // 1024px and up (typical desktop)
};

export const useQueryMedia = () => {
  const [currentLayout, setCurrentLayout] = useState<ScreenLayout>(
    ScreenLayout.Mobile
  );

  useEffect(() => {
    const getScreenLayout = (): ScreenLayout => {
      console.log('Checking screen layout...', window.innerWidth);
      for (const layout in breakpoints) {
        const isMatched = breakpoints[layout as ScreenLayout](
          window.innerWidth
        );
        if (isMatched) {
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
