/**
 * HUDPanel
 *
 * The main panel containing tabs for Tensions, Material, and Fidelity.
 */

import { useMemo } from 'react';
import type { HUDPanelProps, HUDTab } from '../types.js';
import { TensionSlider } from './TensionSlider.js';
import { MaterialPicker } from './MaterialPicker.js';
import { FidelityStatus } from './FidelityStatus.js';

const PANEL_POSITIONS: Record<string, React.CSSProperties> = {
  'bottom-right': { bottom: 80, right: 16 },
  'bottom-left': { bottom: 80, left: 16 },
  'top-right': { top: 80, right: 16 },
  'top-left': { top: 80, left: 16 },
};

const TABS: { id: HUDTab; label: string; icon: string }[] = [
  { id: 'tensions', label: 'Tensions', icon: '⚡' },
  { id: 'material', label: 'Material', icon: '🎨' },
  { id: 'fidelity', label: 'Fidelity', icon: '✓' },
];

export function HUDPanel({
  isOpen,
  onClose,
  position,
  activeTab,
  onTabChange,
}: HUDPanelProps) {
  const panelStyle = useMemo<React.CSSProperties>(
    () => ({
      position: 'fixed',
      ...PANEL_POSITIONS[position],
      zIndex: 99998,
      width: 320,
      maxHeight: 480,
      background: 'linear-gradient(180deg, #1f2937 0%, #111827 100%)',
      borderRadius: 12,
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      overflow: 'hidden',
      opacity: isOpen ? 1 : 0,
      transform: isOpen ? 'translateY(0)' : 'translateY(20px)',
      pointerEvents: isOpen ? 'auto' : 'none',
      transition: 'opacity 0.2s ease, transform 0.2s ease',
    }),
    [isOpen, position]
  );

  return (
    <div style={panelStyle} role="dialog" aria-label="Sigil HUD Panel">
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <span
          style={{
            color: '#fff',
            fontSize: 14,
            fontWeight: 600,
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          Sigil HUD
        </span>
        <button
          onClick={onClose}
          aria-label="Close panel"
          style={{
            background: 'transparent',
            border: 'none',
            color: '#9ca3af',
            cursor: 'pointer',
            padding: 4,
            fontSize: 16,
          }}
        >
          ✕
        </button>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              flex: 1,
              padding: '10px 8px',
              background:
                activeTab === tab.id
                  ? 'rgba(99, 102, 241, 0.2)'
                  : 'transparent',
              border: 'none',
              borderBottom:
                activeTab === tab.id
                  ? '2px solid #6366f1'
                  : '2px solid transparent',
              color: activeTab === tab.id ? '#fff' : '#9ca3af',
              cursor: 'pointer',
              fontSize: 12,
              fontFamily: 'system-ui, sans-serif',
              transition: 'all 0.15s ease',
            }}
          >
            <span style={{ marginRight: 4 }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div
        style={{
          padding: 16,
          maxHeight: 360,
          overflowY: 'auto',
        }}
      >
        {activeTab === 'tensions' && <TensionsPanel />}
        {activeTab === 'material' && <MaterialPanel />}
        {activeTab === 'fidelity' && <FidelityPanel />}
      </div>
    </div>
  );
}

/**
 * Tensions Panel
 *
 * Shows sliders for all tension values.
 */
function TensionsPanel() {
  // These would normally come from useTensions hook
  const tensions = [
    { name: 'playfulness', value: 50 },
    { name: 'density', value: 40 },
    { name: 'speed', value: 60 },
    { name: 'contrast', value: 45 },
    { name: 'depth', value: 55 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <p
        style={{
          margin: 0,
          fontSize: 11,
          color: '#9ca3af',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        Adjust tensions to modify CSS variables in real-time.
      </p>
      {tensions.map((t) => (
        <TensionSlider
          key={t.name}
          name={t.name}
          value={t.value}
          onChange={(v) => console.log(`${t.name}: ${v}`)}
        />
      ))}
    </div>
  );
}

/**
 * Material Panel
 *
 * Shows material picker with zone detection.
 */
function MaterialPanel() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <p
        style={{
          margin: 0,
          fontSize: 11,
          color: '#9ca3af',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        Override zone material for testing.
      </p>
      <MaterialPicker
        value="clay"
        onChange={(m) => console.log(`material: ${m}`)}
        zoneName="default"
      />
    </div>
  );
}

/**
 * Fidelity Panel
 *
 * Shows fidelity validation status.
 */
function FidelityPanel() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <FidelityStatus
        status="pass"
        filesChecked={0}
        violations={[]}
        onValidate={() => console.log('validate')}
      />
    </div>
  );
}

export default HUDPanel;
