import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const LoadingOverlay = ({ isLoading }: any) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setDots(prevDots => {
          switch (prevDots) {
            case '':
              return '.';
            case '.':
              return '..';
            case '..':
              return '...';
            default:
              return '';
          }
        });
      }, 300); // Mengubah titik setiap 500ms

      return () => clearInterval(interval);
    }
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blurred background overlay */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      
      {/* Loading spinner */}
      <div className="relative z-10 flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
        <span className="text-lg font-medium text-white mt-3">
          Tunggu sebentar{dots}
        </span>
      </div>
    </div>
  );
};

export default LoadingOverlay;