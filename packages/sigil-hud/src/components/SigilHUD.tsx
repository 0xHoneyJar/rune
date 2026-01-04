/**
 * SigilHUD
 *
 * Main HUD overlay component that wraps all HUD functionality.
 * Only renders in development mode (process.env.NODE_ENV !== 'production').
 *
 * @example
 * ```tsx
 * import { SigilHUD } from '@sigil/hud';
 *
 * function App() {
 *   return (
 *     <>
 *       <YourApp />
 *       <SigilHUD position="bottom-right" />
 *     </>
 *   );
 * }
 * ```
 */

import { useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import type { SigilHUDProps, HUDTab } from '../types.js';
import { HUDPanel } from './HUDPanel.js';

const TOGGLE_BUTTON_STYLES: Record<string, React.CSSProperties> = {
  'bottom-right': { bottom: 16, right: 16 },
  'bottom-left': { bottom: 16, left: 16 },
  'top-right': { top: 16, right: 16 },
  'top-left': { top: 16, left: 16 },
};

/**
 * Check if we're in development mode.
 * HUD should only render in development.
 */
function isDevelopment(): boolean {
  // Check various ways NODE_ENV might be set
  if (typeof process !== 'undefined' && process.env?.NODE_ENV) {
    return process.env.NODE_ENV !== 'production';
  }
  // Fallback: check if window.__DEV__ is set (common pattern)
  if (typeof window !== 'undefined' && (window as any).__DEV__) {
    return true;
  }
  return false;
}

export function SigilHUD({
  position = 'bottom-right',
  defaultTab = 'tensions',
  defaultExpanded = false,
  className,
}: SigilHUDProps) {
  const [isOpen, setIsOpen] = useState(defaultExpanded);
  const [activeTab, setActiveTab] = useState<HUDTab>(defaultTab);

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleTabChange = useCallback((tab: HUDTab) => {
    setActiveTab(tab);
  }, []);

  // Only render in development
  if (!isDevelopment()) {
    return null;
  }

  // Don't render on server
  if (typeof document === 'undefined') {
    return null;
  }

  const toggleButton = (
    <button
      onClick={handleToggle}
      aria-label={isOpen ? 'Close Sigil HUD' : 'Open Sigil HUD'}
      aria-expanded={isOpen}
      className={className}
      style={{
        position: 'fixed',
        ...TOGGLE_BUTTON_STYLES[position],
        zIndex: 99999,
        width: 48,
        height: 48,
        borderRadius: '50%',
        border: 'none',
        background: isOpen
          ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
          : 'linear-gradient(135deg, #374151 0%, #1f2937 100%)',
        color: '#fff',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        transition: 'transform 0.2s ease, background 0.2s ease',
        fontSize: 20,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {/* Sigil icon - stylized S */}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 6C17 6 15 4 12 4C9 4 7 6 7 8C7 10 9 11 12 12C15 13 17 14 17 16C17 18 15 20 12 20C9 20 7 18 7 18" />
      </svg>
    </button>
  );

  return createPortal(
    <>
      {toggleButton}
      <HUDPanel
        isOpen={isOpen}
        onClose={handleClose}
        position={position}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
    </>,
    document.body
  );
}

export default SigilHUD;
