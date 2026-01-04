/**
 * MaterialPicker
 *
 * A visual picker for selecting material types.
 * Shows current zone and allows override for testing.
 */

import type { MaterialPickerProps, MaterialType } from '../types.js';

const MATERIALS: {
  id: MaterialType;
  label: string;
  description: string;
  color: string;
}[] = [
  {
    id: 'clay',
    label: 'Clay',
    description: 'Heavy, moldable, grounded',
    color: '#d97706',
  },
  {
    id: 'glass',
    label: 'Glass',
    description: 'Light, transparent, sharp',
    color: '#0ea5e9',
  },
  {
    id: 'machinery',
    label: 'Machinery',
    description: 'Precise, mechanical, functional',
    color: '#6b7280',
  },
  {
    id: 'paper',
    label: 'Paper',
    description: 'Thin, layered, tactile',
    color: '#fbbf24',
  },
  {
    id: 'fabric',
    label: 'Fabric',
    description: 'Soft, flowing, textured',
    color: '#8b5cf6',
  },
];

export function MaterialPicker({
  value,
  onChange,
  zoneName,
}: MaterialPickerProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Zone indicator */}
      {zoneName && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 12px',
            background: 'rgba(99, 102, 241, 0.1)',
            borderRadius: 6,
            border: '1px solid rgba(99, 102, 241, 0.2)',
          }}
        >
          <span style={{ fontSize: 12, color: '#9ca3af' }}>Zone:</span>
          <span
            style={{
              fontSize: 12,
              color: '#e5e7eb',
              fontWeight: 500,
              fontFamily: 'monospace',
            }}
          >
            {zoneName}
          </span>
        </div>
      )}

      {/* Material grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 8,
        }}
      >
        {MATERIALS.map((material) => (
          <button
            key={material.id}
            onClick={() => onChange(material.id)}
            style={{
              padding: '12px 10px',
              background:
                value === material.id
                  ? 'rgba(99, 102, 241, 0.2)'
                  : 'rgba(55, 65, 81, 0.5)',
              border:
                value === material.id
                  ? '2px solid #6366f1'
                  : '2px solid transparent',
              borderRadius: 8,
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s ease',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 4,
              }}
            >
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 3,
                  background: material.color,
                }}
              />
              <span
                style={{
                  fontSize: 12,
                  color: '#e5e7eb',
                  fontWeight: 500,
                  fontFamily: 'system-ui, sans-serif',
                }}
              >
                {material.label}
              </span>
            </div>
            <span
              style={{
                fontSize: 10,
                color: '#9ca3af',
                fontFamily: 'system-ui, sans-serif',
              }}
            >
              {material.description}
            </span>
          </button>
        ))}
      </div>

      {/* Reset button */}
      <button
        onClick={() => onChange('clay')}
        style={{
          padding: '8px 12px',
          background: 'transparent',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: 6,
          color: '#9ca3af',
          fontSize: 11,
          cursor: 'pointer',
          fontFamily: 'system-ui, sans-serif',
          transition: 'all 0.15s ease',
        }}
      >
        Reset to Zone Default
      </button>
    </div>
  );
}

export default MaterialPicker;
