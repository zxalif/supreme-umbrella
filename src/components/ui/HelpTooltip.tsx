'use client';

import { useState, useRef, useEffect } from 'react';
import { HelpCircle, Info } from 'lucide-react';

interface HelpTooltipProps {
  content: string;
  icon?: 'help' | 'info';
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * HelpTooltip Component
 * 
 * A reusable tooltip component for help text and explanations
 */
export function HelpTooltip({ 
  content, 
  icon = 'help',
  position = 'top',
  className = '',
  size = 'sm'
}: HelpTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isVisible && tooltipRef.current && triggerRef.current) {
      // Batch DOM reads and writes using requestAnimationFrame to avoid forced reflows
      requestAnimationFrame(() => {
        if (tooltipRef.current && triggerRef.current) {
          const tooltip = tooltipRef.current;
          const trigger = triggerRef.current;
          
          // Batch all DOM reads first
          const rect = trigger.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          const windowWidth = window.innerWidth;
          
          // Then batch all DOM writes in the same frame
          switch (position) {
            case 'top':
              tooltip.style.bottom = `${windowHeight - rect.top + 8}px`;
              tooltip.style.left = `${rect.left + rect.width / 2}px`;
              tooltip.style.transform = 'translateX(-50%)';
              break;
            case 'bottom':
              tooltip.style.top = `${rect.bottom + 8}px`;
              tooltip.style.left = `${rect.left + rect.width / 2}px`;
              tooltip.style.transform = 'translateX(-50%)';
              break;
            case 'left':
              tooltip.style.right = `${windowWidth - rect.left + 8}px`;
              tooltip.style.top = `${rect.top + rect.height / 2}px`;
              tooltip.style.transform = 'translateY(-50%)';
              break;
            case 'right':
              tooltip.style.left = `${rect.right + 8}px`;
              tooltip.style.top = `${rect.top + rect.height / 2}px`;
              tooltip.style.transform = 'translateY(-50%)';
              break;
          }
        }
      });
    }
  }, [isVisible, position]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        triggerRef.current &&
        !tooltipRef.current.contains(event.target as Node) &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsVisible(false);
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isVisible]);

  const IconComponent = icon === 'help' ? HelpCircle : Info;
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
        className="inline-flex items-center justify-center text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors"
        aria-label="Help"
      >
        <IconComponent className={sizeClasses[size]} />
      </button>

      {isVisible && (
        <div
          ref={tooltipRef}
          className={`fixed z-[10000] px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg max-w-xs pointer-events-none ${
            position === 'top' ? 'mb-2' : ''
          }`}
          role="tooltip"
        >
          {content}
          {/* Arrow */}
          <div
            className={`absolute ${
              position === 'top'
                ? 'top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900'
                : position === 'bottom'
                ? 'bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-gray-900'
                : position === 'left'
                ? 'left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-gray-900'
                : 'right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-900'
            }`}
          />
        </div>
      )}
    </div>
  );
}

