'use client';

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  ReactNode
} from 'react';
import { createPortal } from 'react-dom';

export type PopperPlacement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end';

export interface PopperProps {
  /** The element that triggers the popper */
  anchorEl?: HTMLElement | null;
  /** Content to display in the popper */
  children: ReactNode;
  /** Whether the popper is open */
  open: boolean;
  /** Callback fired when the popper should close */
  onClose?: () => void;
  /** Placement of the popper relative to the anchor element */
  placement?: PopperPlacement;
  /** Offset from the anchor element */
  offset?: number;
  /** Whether to show an arrow pointing to the anchor */
  showArrow?: boolean;
  /** Custom className for the popper */
  className?: string;
  /** Custom className for the arrow */
  arrowClassName?: string;
  /** Whether to disable portal rendering */
  disablePortal?: boolean;
  /** Custom z-index */
  zIndex?: string;
  /** Whether to close on click outside */
  closeOnClickOutside?: boolean;
  /** Whether to close on escape key */
  closeOnEscape?: boolean;
  /** Custom modifiers for positioning */
  modifiers?: Array<{
    name: string;
    enabled?: boolean;
    options?: any;
  }>;
}

interface Position {
  top: number;
  left: number;
  transformOrigin: string;
}

const Popper: React.FC<PopperProps> = ({
  anchorEl,
  children,
  open,
  onClose,
  placement = 'bottom',
  offset = 8,
  showArrow = false,
  className = '',
  arrowClassName = '',
  disablePortal = false,
  zIndex = `z-[50]`,
  closeOnClickOutside = true,
  closeOnEscape = true,
  modifiers = []
}) => {
  const popperRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<Position>({
    top: 0,
    left: 0,
    transformOrigin: 'top left'
  });
  const [arrowPosition, setArrowPosition] = useState<{
    top?: number;
    left?: number;
    transform?: string;
  }>({});

  // Calculate position based on anchor element and placement
  const calculatePosition = useCallback(() => {
    if (!anchorEl || !popperRef.current) return;

    const anchorRect = anchorEl.getBoundingClientRect();
    const popperRect = popperRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let top = 0;
    let left = 0;
    let transformOrigin = 'top left';

    // Calculate base position based on placement
    switch (placement) {
      case 'top':
        top = anchorRect.top - popperRect.height - offset;
        left = anchorRect.left + (anchorRect.width - popperRect.width) / 2;
        transformOrigin = 'bottom center';
        break;
      case 'top-start':
        top = anchorRect.top - popperRect.height - offset;
        left = anchorRect.left;
        transformOrigin = 'bottom left';
        break;
      case 'top-end':
        top = anchorRect.top - popperRect.height - offset;
        left = anchorRect.right - popperRect.width;
        transformOrigin = 'bottom right';
        break;
      case 'bottom':
        top = anchorRect.bottom + offset;
        left = anchorRect.left + (anchorRect.width - popperRect.width) / 2;
        transformOrigin = 'top center';
        break;
      case 'bottom-start':
        top = anchorRect.bottom + offset;
        left = anchorRect.left;
        transformOrigin = 'top left';
        break;
      case 'bottom-end':
        top = anchorRect.bottom + offset;
        left = anchorRect.right - popperRect.width;
        transformOrigin = 'top right';
        break;
      case 'left':
        top = anchorRect.top + (anchorRect.height - popperRect.height) / 2;
        left = anchorRect.left - popperRect.width - offset;
        transformOrigin = 'right center';
        break;
      case 'left-start':
        top = anchorRect.top;
        left = anchorRect.left - popperRect.width - offset;
        transformOrigin = 'right top';
        break;
      case 'left-end':
        top = anchorRect.bottom - popperRect.height;
        left = anchorRect.left - popperRect.width - offset;
        transformOrigin = 'right bottom';
        break;
      case 'right':
        top = anchorRect.top + (anchorRect.height - popperRect.height) / 2;
        left = anchorRect.right + offset;
        transformOrigin = 'left center';
        break;
      case 'right-start':
        top = anchorRect.top;
        left = anchorRect.right + offset;
        transformOrigin = 'left top';
        break;
      case 'right-end':
        top = anchorRect.bottom - popperRect.height;
        left = anchorRect.right + offset;
        transformOrigin = 'left bottom';
        break;
    }

    // Adjust position to keep within viewport
    if (left < 0) left = 8;
    if (left + popperRect.width > viewportWidth)
      left = viewportWidth - popperRect.width - 8;
    if (top < 0) top = 8;
    if (top + popperRect.height > viewportHeight)
      top = viewportHeight - popperRect.height - 8;

    setPosition({ top, left, transformOrigin });

    // Calculate arrow position
    if (showArrow) {
      let arrowTop: number | undefined;
      let arrowLeft: number | undefined;
      let transform: string | undefined;

      switch (placement) {
        case 'top':
        case 'top-start':
        case 'top-end':
          arrowTop = popperRect.height;
          arrowLeft = Math.min(
            Math.max(anchorRect.left + anchorRect.width / 2 - left, 12),
            popperRect.width - 12
          );
          transform = 'rotate(180deg)';
          break;
        case 'bottom':
        case 'bottom-start':
        case 'bottom-end':
          arrowTop = -8;
          arrowLeft = Math.min(
            Math.max(anchorRect.left + anchorRect.width / 2 - left, 12),
            popperRect.width - 12
          );
          break;
        case 'left':
        case 'left-start':
        case 'left-end':
          arrowTop = Math.min(
            Math.max(anchorRect.top + anchorRect.height / 2 - top, 12),
            popperRect.height - 12
          );
          arrowLeft = popperRect.width;
          transform = 'rotate(90deg)';
          break;
        case 'right':
        case 'right-start':
        case 'right-end':
          arrowTop = Math.min(
            Math.max(anchorRect.top + anchorRect.height / 2 - top, 12),
            popperRect.height - 12
          );
          arrowLeft = -8;
          transform = 'rotate(-90deg)';
          break;
      }

      setArrowPosition({ top: arrowTop, left: arrowLeft, transform });
    }
  }, [anchorEl, placement, offset, showArrow]);

  // Update position when dependencies change
  useEffect(() => {
    if (open) {
      calculatePosition();

      // Recalculate on scroll and resize
      const handleUpdate = () => calculatePosition();
      window.addEventListener('scroll', handleUpdate, true);
      window.addEventListener('resize', handleUpdate);

      return () => {
        window.removeEventListener('scroll', handleUpdate, true);
        window.removeEventListener('resize', handleUpdate);
      };
    }
  }, [open, calculatePosition]);

  // Handle escape key
  useEffect(() => {
    if (!open || !closeOnEscape || !onClose) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, closeOnEscape, onClose]);

  if (!open || !anchorEl) return null;

  const popperContent = (
    <div
      ref={popperRef}
      className={`fixed bg-white rounded-lg shadow-lg border border-gray-200 ${zIndex} ${className}`}
      style={{
        top: position.top,
        left: position.left,
        transformOrigin: position.transformOrigin
      }}
    >
      {children}
      {showArrow && (
        <div
          className={`absolute w-4 h-4 bg-white border border-gray-200 ${arrowClassName}`}
          style={{
            top: arrowPosition.top,
            left: arrowPosition.left,
            transform: `${arrowPosition.transform} rotate(45deg)`,
            clipPath: 'polygon(0% 0%, 100% 100%, 0% 100%)'
          }}
        />
      )}
    </div>
  );

  return disablePortal
    ? popperContent
    : createPortal(popperContent, document.body);
};

export default Popper;
