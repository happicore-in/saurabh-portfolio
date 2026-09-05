import React, { useEffect, useRef } from 'react';
import { CursorState } from '../../types';

interface CustomCursorProps {
  cursorState: CursorState;
}

export const CustomCursor: React.FC<CustomCursorProps> = ({ cursorState }) => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  // Keep target positions in refs to completely eliminate React re-renders on mousemove
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const isVisible = useRef(false);
  const isHovered = useRef(false);
  const rafId = useRef<number | null>(null);

  // Sync cursorState label to ref without re-triggering render cycles
  const cursorStateRef = useRef<CursorState>(cursorState);
  cursorStateRef.current = cursorState;

  useEffect(() => {
    // 1. Immediately disable on touch devices, coarse pointers, or reduced-motion preferences
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!hasFinePointer || isCoarse || prefersReducedMotion) {
      return;
    }

    const dotEl = dotRef.current;
    const ringEl = ringRef.current;
    const labelEl = labelRef.current;
    if (!dotEl || !ringEl) return;

    // Helper for cursor labels based on state
    const getLabelText = (state: CursorState, hovered: boolean): string => {
      switch (state) {
        case 'project':
          return 'VIEW';
        case 'video':
          return 'PLAY';
        case 'open':
          return 'OPEN';
        case 'code':
          return 'CODE';
        case 'contact':
          return 'TALK';
        default:
          return hovered ? '' : '';
      }
    };

    // 2. Hardware-accelerated rAF animation loop for the trailing ring
    const renderLoop = () => {
      if (isVisible.current) {
        // Smooth linear interpolation (lerp) with optimal damping for responsive, jitter-free trailing
        const lerpFactor = 0.18;
        ringPos.current.x += (mousePos.current.x - ringPos.current.x) * lerpFactor;
        ringPos.current.y += (mousePos.current.y - ringPos.current.y) * lerpFactor;

        const activeState = cursorStateRef.current;
        const hasCustomLabel = activeState !== 'default' && activeState !== 'hidden';
        const targetScale = hasCustomLabel ? 2.2 : isHovered.current ? 1.5 : 1.0;

        // Use translate3d exclusively for direct GPU compositing
        ringEl.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%) scale(${targetScale})`;

        // Update label text and visibility
        if (labelEl) {
          const labelText = getLabelText(activeState, isHovered.current);
          if (labelText) {
            if (labelEl.textContent !== labelText) {
              labelEl.textContent = labelText;
            }
            labelEl.style.opacity = '1';
            labelEl.style.transform = 'scale(1)';
          } else {
            labelEl.style.opacity = '0';
            labelEl.style.transform = 'scale(0.6)';
          }
        }
      }

      rafId.current = requestAnimationFrame(renderLoop);
    };

    // 3. Pointer Move Handler (Direct DOM manipulation - ZERO setState)
    const handlePointerMove = (e: PointerEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;

      if (!isVisible.current) {
        isVisible.current = true;
        ringPos.current.x = e.clientX;
        ringPos.current.y = e.clientY;
        dotEl.style.opacity = '1';
        ringEl.style.opacity = '1';
      }

      // Move primary dot instantly
      dotEl.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
    };

    // 4. Interactive Element Hover Detection via Document Pointer Delegation
    const handlePointerOver = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest(
        'button, a, [role="button"], input, textarea, select, .cursor-pointer, [data-cursor]'
      );

      if (interactive) {
        isHovered.current = true;
        ringEl.style.borderColor = 'rgba(255, 255, 255, 0.9)';
        ringEl.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
        dotEl.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0) translate(-50%, -50%) scale(0.6)`;
      }
    };

    const handlePointerOut = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest(
        'button, a, [role="button"], input, textarea, select, .cursor-pointer, [data-cursor]'
      );

      if (interactive) {
        isHovered.current = false;
        ringEl.style.borderColor = 'rgba(255, 255, 255, 0.35)';
        ringEl.style.backgroundColor = 'transparent';
        dotEl.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0) translate(-50%, -50%) scale(1)`;
      }
    };

    // 5. Visibility handlers when pointer leaves window
    const handlePointerLeave = () => {
      isVisible.current = false;
      dotEl.style.opacity = '0';
      ringEl.style.opacity = '0';
    };

    const handlePointerEnter = () => {
      isVisible.current = true;
      dotEl.style.opacity = '1';
      ringEl.style.opacity = '1';
    };

    // Attach passive listeners
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('pointerover', handlePointerOver, { passive: true });
    document.addEventListener('pointerout', handlePointerOut, { passive: true });
    document.addEventListener('pointerleave', handlePointerLeave, { passive: true });
    document.addEventListener('pointerenter', handlePointerEnter, { passive: true });

    // Start single global rAF loop
    rafId.current = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerover', handlePointerOver);
      document.removeEventListener('pointerout', handlePointerOut);
      document.removeEventListener('pointerleave', handlePointerLeave);
      document.removeEventListener('pointerenter', handlePointerEnter);

      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  // Quick check on mount: If touch device, do not render markup at all
  if (typeof window !== 'undefined') {
    const hasCoarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (hasCoarse || reducedMotion) {
      return null;
    }
  }

  return (
    <div 
      id="hardware-accelerated-cursor-layer"
      className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden hidden md:block"
      aria-hidden="true"
    >
      {/* Primary Center Precision Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-[#F5F5F4] pointer-events-none will-change-transform opacity-0 transition-opacity duration-200"
        style={{ transform: 'translate3d(-100px, -100px, 0)' }}
      />

      {/* Smooth Trailing Follower Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-white/35 pointer-events-none will-change-transform opacity-0 flex items-center justify-center transition-colors duration-200"
        style={{ transform: 'translate3d(-100px, -100px, 0)' }}
      >
        {/* Dynamic Context Label Pill */}
        <span
          ref={labelRef}
          className="text-[8px] font-mono font-bold tracking-widest text-[#F5F5F4] uppercase select-none opacity-0 transition-all duration-150 transform scale-75"
        />
      </div>
    </div>
  );
};
