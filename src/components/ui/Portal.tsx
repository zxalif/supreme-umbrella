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
      containerElement.style.pointerEvents = 'auto';
      containerElement.style.zIndex = '9999';
      // Don't set overflow here - let modals handle their own scroll locking
      document.body.appendChild(containerElement);
      console.log('[Portal] Created container:', containerId);
    } else {
      console.log('[Portal] Reusing existing container:', containerId);
      // Ensure pointer-events is set when reusing
      containerElement.style.pointerEvents = 'auto';
    }

    setContainer(containerElement);
    setMounted(true);

    return () => {
      // When Portal unmounts (modal closes), disable pointer events on container
      // This prevents the empty container from blocking interactions
      if (containerElement) {
        // Use setTimeout to ensure this runs after React has removed children
        setTimeout(() => {
          if (containerElement && containerElement.children.length === 0) {
            console.log('[Portal] Container is empty - disabling pointer events');
            containerElement.style.pointerEvents = 'none';
            containerElement.style.display = 'none';
          }
        }, 0);
      }
    };
  }, [containerId]);

  // Update container pointer-events when children change
  useEffect(() => {
    if (container && mounted) {
      if (children) {
        container.style.pointerEvents = 'auto';
        container.style.display = 'block';
      } else {
        container.style.pointerEvents = 'none';
        container.style.display = 'none';
      }
    }
  }, [children, container, mounted]);

  if (!mounted || !container) {
    return null;
  }

  return createPortal(children, container);
}
