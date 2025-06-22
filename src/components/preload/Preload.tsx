'use client';

import Image from 'next/image';
import { useQueryMedia } from '@/hooks/useQueryLayout';
import { ScreenLayout } from '@/constants/common';
import { useState, useEffect } from 'react';

export default function Preload() {
  const [removeLoading, setRemoveLoading] = useState<boolean>(false);
  const [loadingMedia, setLoadingMedia] = useState<boolean>(true);
  const currentLayout = useQueryMedia();

  useEffect(() => {
    if (!loadingMedia) {
      const timer = setTimeout(() => {
        setRemoveLoading(true);
      }, 3000); // Simulate loading time

      return () => clearTimeout(timer);
    }
  }, [loadingMedia]);
  useEffect(() => {
    if (currentLayout === ScreenLayout.Mobile) {
      setLoadingMedia(false);
    }
  }, [currentLayout]);
  return (
    <>
      {!removeLoading && (
        <div
          className={`fixed w-screen h-screen flex items-center justify-center bg-white transition-all duration-300 ease-in-out ${
            loadingMedia ? 'z-1000 opacity-100' : 'opacity-0 z-0'
          }`}
        >
          <Image
            src="/logo.png"
            alt="TAN cupholder logo"
            width={200}
            height={200}
            className={`rounded-full animate-fade-in-out`}
          />
        </div>
      )}
    </>
  );
}
