'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: React.ReactNode;
  containerId?: string;
}

export function Portal({ children, containerId = 'modal-root' }: PortalProps) {
  const [mounted, setMounted] = useState(false);
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Create or get the container element
    let containerElement = document.getElementById(containerId);
    
    if (!containerElement) {
      containerElement = document.createElement('div');
      containerElement.id = containerId;
      containerElement.style.position = 'fixed';
      containerElement.style.top = '0';
      containerElement.style.left = '0';
      containerElement.style.width = '100%';
      containerElement.style.height = '100%';
      containerElement.style.pointerEvents = 'none';
      containerElement.style.zIndex = '9999';
      document.body.appendChild(containerElement);
    }

    setContainer(containerElement);
    setMounted(true);

    return () => {
      // Don't remove the container on unmount as it might be used by other modals
    };
  }, [containerId]);

  if (!mounted || !container) {
    return null;
  }

  return createPortal(children, container);
}
