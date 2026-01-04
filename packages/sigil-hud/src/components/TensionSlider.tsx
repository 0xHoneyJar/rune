/**
 * TensionSlider
 *
 * A styled slider for adjusting individual tension values.
 * Updates CSS variables in real-time (<16ms target).
 */

import { useCallback, useRef } from 'react';
import type { TensionSliderProps } from '../types.js';

export function TensionSlider({
  name,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
}: TensionSliderProps) {
  const rafRef = useRef<number | null>(null);

  // Throttle updates using requestAnimationFrame for <16ms performance
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = Number(e.target.value);

      // Cancel any pending RAF
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      // Schedule update for next frame
      rafRef.current = requestAnimationFrame(() => {
        onChange(newValue);
        rafRef.current = null;
      });
    },
    [onChange]
  );

  // Format name for display (playfulness -> Playfulness)
  const displayName = name.charAt(0).toUpperCase() + name.slice(1);

  // Calculate percentage for gradient
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <label
          htmlFor={`tension-${name}`}
          style={{
            fontSize: 12,
            color: '#e5e7eb',
            fontFamily: 'system-ui, sans-serif',
            fontWeight: 500,
          }}
        >
          {displayName}
        </label>
        <span
          style={{
            fontSize: 11,
            color: '#6366f1',
            fontFamily: 'monospace',
            fontWeight: 600,
          }}
        >
          {value}
        </span>
      </div>
      <input
        id={`tension-${name}`}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        style={{
          width: '100%',
          height: 6,
          borderRadius: 3,
          appearance: 'none',
          background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${percentage}%, #374151 ${percentage}%, #374151 100%)`,
          cursor: 'pointer',
          outline: 'none',
        }}
      />
    </div>
  );
}

export default TensionSlider;
