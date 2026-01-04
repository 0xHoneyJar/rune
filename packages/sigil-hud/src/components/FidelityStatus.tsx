/**
 * FidelityStatus
 *
 * Displays validation status against the Fidelity Ceiling.
 * Shows pass/warn/error state and lists violations.
 */

import type { FidelityStatusProps, FidelityLevel } from '../types.js';

const STATUS_COLORS: Record<FidelityLevel, { bg: string; text: string; icon: string }> = {
  pass: { bg: 'rgba(34, 197, 94, 0.1)', text: '#22c55e', icon: '✓' },
  warn: { bg: 'rgba(234, 179, 8, 0.1)', text: '#eab308', icon: '⚠' },
  error: { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444', icon: '✕' },
};

export function FidelityStatus({
  status,
  filesChecked,
  violations,
  onValidate,
}: FidelityStatusProps) {
  const colors = STATUS_COLORS[status];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Status badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          background: colors.bg,
          borderRadius: 8,
          border: `1px solid ${colors.text}33`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            style={{
              fontSize: 20,
              color: colors.text,
            }}
          >
            {colors.icon}
          </span>
          <div>
            <div
              style={{
                fontSize: 13,
                color: '#e5e7eb',
                fontWeight: 600,
                fontFamily: 'system-ui, sans-serif',
                textTransform: 'capitalize',
              }}
            >
              {status === 'pass'
                ? 'All Clear'
                : status === 'warn'
                  ? 'Warnings Found'
                  : 'Violations Found'}
            </div>
            <div
              style={{
                fontSize: 11,
                color: '#9ca3af',
                fontFamily: 'system-ui, sans-serif',
              }}
            >
              {filesChecked} files checked
            </div>
          </div>
        </div>
      </div>

      {/* Violations list */}
      {violations.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            maxHeight: 200,
            overflowY: 'auto',
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: '#9ca3af',
              fontFamily: 'system-ui, sans-serif',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Violations ({violations.length})
          </div>
          {violations.map((v, i) => (
            <div
              key={i}
              style={{
                padding: '8px 10px',
                background: 'rgba(55, 65, 81, 0.5)',
                borderRadius: 6,
                borderLeft: `3px solid ${STATUS_COLORS[v.severity].text}`,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: '#e5e7eb',
                  fontFamily: 'monospace',
                  marginBottom: 4,
                }}
              >
                {v.file}
                {v.line && `:${v.line}`}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: '#9ca3af',
                  fontFamily: 'system-ui, sans-serif',
                }}
              >
                {v.message}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {violations.length === 0 && filesChecked === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '20px 16px',
            color: '#9ca3af',
            fontSize: 12,
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          Run validation to check fidelity ceiling compliance.
        </div>
      )}

      {/* Validate button */}
      {onValidate && (
        <button
          onClick={onValidate}
          style={{
            padding: '10px 16px',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            border: 'none',
            borderRadius: 6,
            color: '#fff',
            fontSize: 12,
            fontWeight: 500,
            cursor: 'pointer',
            fontFamily: 'system-ui, sans-serif',
            transition: 'transform 0.15s ease, opacity 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.9';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
        >
          Run Validation
        </button>
      )}
    </div>
  );
}

export default FidelityStatus;
