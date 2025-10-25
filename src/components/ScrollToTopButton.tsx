import React, { useState, useEffect, useCallback } from 'react';
import { FiArrowUp } from "react-icons/fi";

const ScrollButtons = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Optimized scroll handler using RAF
  const handleScroll = useCallback(() => {
    requestAnimationFrame(() => {
      const scrolled = window.scrollY;
      const winHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrolled / winHeight) * 100;
      
      setScrollProgress(scrollPercent);
      setIsVisible(scrolled > 300);
    });
  }, []);

  // Smooth scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Check for mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Add scroll listener
  useEffect(() => {
    let rafId: number;
    const throttledScroll = () => {
      rafId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', throttledScroll);
      cancelAnimationFrame(rafId);
    };
  }, [handleScroll]);

  if (!isVisible || isMobile) return null;

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <button
        onClick={scrollToTop}
        className="group relative w-12 h-12 bg-black dark:bg-white text-white dark:text-black rounded-full shadow-lg focus:outline-none overflow-hidden transform transition-all duration-200 hover:scale-105 active:scale-95"
        aria-label="Scroll to top"
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <FiArrowUp 
            size={24} 
            className="transform transition-transform duration-200 group-hover:-translate-y-1" 
          />
        </div>
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle
            cx="24"
            cy="24"
            r="20"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            className="opacity-25"
          />
          <circle
            cx="24"
            cy="24"
            r="20"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            style={{
              strokeDasharray: `${2 * Math.PI * 20}`,
              strokeDashoffset: `${2 * Math.PI * 20 * (1 - scrollProgress / 100)}`,
              transition: 'stroke-dashoffset 0.1s ease-out'
            }}
          />
        </svg>
      </button>
    </div>
  );
};

export default ScrollButtons;