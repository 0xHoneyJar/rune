/**
 * Sigil Toolbar - Main UI Component
 * Floating toolbar with physics tools, annotation, and feedback
 */

import { h, render } from 'preact'
import { useState, useEffect, useCallback, useRef } from 'preact/hooks'
import type { PhysicsConfig, Violation, Annotation, CapabilityAudit } from '../shared/types'
import { detectPhysics } from '../content/physics-detector'
import { auditPage } from '../content/violation-checker'
import { toggleAnimations, getAnimationSummary, type AnimationSummary } from '../content/animation-inspector'
import { auditCapabilities } from '../content/capability-auditor'
import { startAnnotation } from '../content/annotator'

// ============================================================================
// Types
// ============================================================================

interface ToolbarState {
  isOpen: boolean
  position: { x: number; y: number }
  activePanel: 'none' | 'physics' | 'animation' | 'audit' | 'menu'
  inspectedElement: Element | null
  inspectedPhysics: PhysicsConfig | null
  violations: Violation[]
  animationState: AnimationSummary | null
  capabilityAudit: CapabilityAudit | null
  isAnnotating: boolean
}

// ============================================================================
// Icons (inline SVG for bundle size)
// ============================================================================

const icons = {
  physics: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  ),
  animation: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  ),
  audit: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
    </svg>
  ),
  screenshot: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
  ),
  annotate: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
    </svg>
  ),
  menu: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
  close: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  drag: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.5">
      <circle cx="9" cy="5" r="1" fill="currentColor" />
      <circle cx="9" cy="12" r="1" fill="currentColor" />
      <circle cx="9" cy="19" r="1" fill="currentColor" />
      <circle cx="15" cy="5" r="1" fill="currentColor" />
      <circle cx="15" cy="12" r="1" fill="currentColor" />
      <circle cx="15" cy="19" r="1" fill="currentColor" />
    </svg>
  ),
}

// ============================================================================
// Toolbar Component
// ============================================================================

function Toolbar() {
  const [state, setState] = useState<ToolbarState>({
    isOpen: true,
    position: { x: 20, y: 20 },
    activePanel: 'none',
    inspectedElement: null,
    inspectedPhysics: null,
    violations: [],
    animationState: null,
    capabilityAudit: null,
    isAnnotating: false,
  })

  const toolbarRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const dragOffset = useRef({ x: 0, y: 0 })

  // -------------------------------------------------------------------------
  // Dragging
  // -------------------------------------------------------------------------

  const handleDragStart = useCallback((e: MouseEvent) => {
    if (!toolbarRef.current) return
    isDragging.current = true
    const rect = toolbarRef.current.getBoundingClientRect()
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
    document.body.style.userSelect = 'none'
  }, [])

  const handleDragMove = useCallback((e: MouseEvent) => {
    if (!isDragging.current) return
    setState(prev => ({
      ...prev,
      position: {
        x: Math.max(0, Math.min(window.innerWidth - 300, e.clientX - dragOffset.current.x)),
        y: Math.max(0, Math.min(window.innerHeight - 60, e.clientY - dragOffset.current.y)),
      },
    }))
  }, [])

  const handleDragEnd = useCallback(() => {
    isDragging.current = false
    document.body.style.userSelect = ''
  }, [])

  useEffect(() => {
    document.addEventListener('mousemove', handleDragMove)
    document.addEventListener('mouseup', handleDragEnd)
    return () => {
      document.removeEventListener('mousemove', handleDragMove)
      document.removeEventListener('mouseup', handleDragEnd)
    }
  }, [handleDragMove, handleDragEnd])

  // -------------------------------------------------------------------------
  // Keyboard Shortcuts
  // -------------------------------------------------------------------------

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape closes panels or annotation mode
      if (e.key === 'Escape') {
        if (state.isAnnotating) {
          setState(prev => ({ ...prev, isAnnotating: false }))
        } else if (state.activePanel !== 'none') {
          setState(prev => ({ ...prev, activePanel: 'none' }))
        }
        return
      }

      // Alt+Shift shortcuts
      if (e.altKey && e.shiftKey) {
        switch (e.key.toLowerCase()) {
          case 'p':
            e.preventDefault()
            handlePhysicsInspect()
            break
          case 'a':
            e.preventDefault()
            handleAnimationToggle()
            break
          case 'c':
            e.preventDefault()
            handleCapabilityAudit()
            break
          case 's':
            e.preventDefault()
            handleScreenshot()
            break
          case 'n':
            e.preventDefault()
            handleAnnotate()
            break
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [state.isAnnotating, state.activePanel])

  // -------------------------------------------------------------------------
  // Tool Handlers
  // -------------------------------------------------------------------------

  const handlePhysicsInspect = useCallback(() => {
    // Run page audit for violations
    const violations = auditPage()

    // Get element under cursor if available
    const activeElement = document.activeElement
    let physics: PhysicsConfig | null = null
    if (activeElement && activeElement !== document.body) {
      physics = detectPhysics(activeElement)
    }

    setState(prev => ({
      ...prev,
      activePanel: prev.activePanel === 'physics' ? 'none' : 'physics',
      violations,
      inspectedElement: activeElement !== document.body ? activeElement : null,
      inspectedPhysics: physics,
    }))
  }, [])

  const handleAnimationToggle = useCallback(() => {
    const result = toggleAnimations()
    const summary = getAnimationSummary()

    setState(prev => ({
      ...prev,
      activePanel: 'animation',
      animationState: {
        ...summary,
        isPaused: result.isPaused,
      },
    }))
  }, [])

  const handleCapabilityAudit = useCallback(() => {
    const audit = auditCapabilities()

    setState(prev => ({
      ...prev,
      activePanel: prev.activePanel === 'audit' ? 'none' : 'audit',
      capabilityAudit: audit,
    }))
  }, [])

  const handleScreenshot = useCallback(async () => {
    try {
      const response = await chrome.runtime.sendMessage({
        type: 'CAPTURE_SCREENSHOT',
        payload: {
          bounds: {
            x: 0,
            y: 0,
            width: window.innerWidth,
            height: window.innerHeight,
          },
          padding: 0,
        },
      })

      if (response?.success && response.data) {
        // Open screenshot in new tab
        const win = window.open()
        if (win) {
          win.document.write(`<img src="${response.data}" style="max-width: 100%;" />`)
        }
      }
    } catch (error) {
      console.error('[Sigil] Screenshot failed:', error)
    }
  }, [])

  const handleAnnotate = useCallback(async () => {
    setState(prev => ({ ...prev, isAnnotating: true, activePanel: 'none' }))

    const annotation = await startAnnotation()

    setState(prev => ({ ...prev, isAnnotating: false }))

    if (annotation) {
      // Show annotation result
      console.log('[Sigil] Annotation captured:', annotation)
      // TODO: Open feedback modal with annotation
    }
  }, [])

  const handleMenuToggle = useCallback(() => {
    setState(prev => ({
      ...prev,
      activePanel: prev.activePanel === 'menu' ? 'none' : 'menu',
    }))
  }, [])

  const closePanel = useCallback(() => {
    setState(prev => ({ ...prev, activePanel: 'none' }))
  }, [])

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  if (!state.isOpen) return null

  return (
    <div
      ref={toolbarRef}
      class="sigil-toolbar"
      style={{
        left: `${state.position.x}px`,
        top: `${state.position.y}px`,
      }}
    >
      {/* Drag Handle */}
      <div class="sigil-drag-handle" onMouseDown={handleDragStart}>
        {icons.drag}
      </div>

      {/* Tool Buttons */}
      <button
        class={`sigil-tool-btn ${state.activePanel === 'physics' ? 'active' : ''}`}
        onClick={handlePhysicsInspect}
        title="Physics Inspector (Alt+Shift+P)"
      >
        {icons.physics}
      </button>

      <button
        class={`sigil-tool-btn ${state.activePanel === 'animation' ? 'active' : ''}`}
        onClick={handleAnimationToggle}
        title="Toggle Animations (Alt+Shift+A)"
      >
        {icons.animation}
      </button>

      <button
        class={`sigil-tool-btn ${state.activePanel === 'audit' ? 'active' : ''}`}
        onClick={handleCapabilityAudit}
        title="Capability Audit (Alt+Shift+C)"
      >
        {icons.audit}
      </button>

      <button
        class="sigil-tool-btn"
        onClick={handleScreenshot}
        title="Screenshot (Alt+Shift+S)"
      >
        {icons.screenshot}
      </button>

      <button
        class={`sigil-tool-btn ${state.isAnnotating ? 'active' : ''}`}
        onClick={handleAnnotate}
        title="Annotate Element (Alt+Shift+N)"
      >
        {icons.annotate}
      </button>

      <button
        class={`sigil-tool-btn ${state.activePanel === 'menu' ? 'active' : ''}`}
        onClick={handleMenuToggle}
        title="Settings Menu"
      >
        {icons.menu}
      </button>

      {/* Panels */}
      {state.activePanel === 'physics' && (
        <PhysicsPanel
          violations={state.violations}
          physics={state.inspectedPhysics}
          onClose={closePanel}
        />
      )}

      {state.activePanel === 'animation' && state.animationState && (
        <AnimationPanel
          state={state.animationState}
          onClose={closePanel}
        />
      )}

      {state.activePanel === 'audit' && state.capabilityAudit && (
        <AuditPanel
          audit={state.capabilityAudit}
          onClose={closePanel}
        />
      )}

      {state.activePanel === 'menu' && (
        <MenuPanel onClose={closePanel} />
      )}

      {/* Annotating Indicator */}
      {state.isAnnotating && (
        <div class="sigil-annotating-indicator">
          Click an element to annotate (Esc to cancel)
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Panel Components
// ============================================================================

interface PhysicsPanelProps {
  violations: Violation[]
  physics: PhysicsConfig | null
  onClose: () => void
}

function PhysicsPanel({ violations, physics, onClose }: PhysicsPanelProps) {
  return (
    <div class="sigil-panel">
      <div class="sigil-panel-header">
        <span>⚡ Physics Inspector</span>
        <button class="sigil-close-btn" onClick={onClose}>{icons.close}</button>
      </div>
      <div class="sigil-panel-content">
        {physics && (
          <div class="sigil-physics-info">
            <h4>Detected Physics</h4>
            <div class="sigil-physics-grid">
              <span>Effect:</span><span>{physics.effect}</span>
              <span>Sync:</span><span>{physics.sync}</span>
              <span>Timing:</span><span>{physics.timing}ms</span>
              {physics.confirmation && (
                <>
                  <span>Confirm:</span><span>Required</span>
                </>
              )}
            </div>
          </div>
        )}

        <div class="sigil-violations">
          <h4>Violations ({violations.length})</h4>
          {violations.length === 0 ? (
            <p class="sigil-success">✓ No violations found</p>
          ) : (
            <ul class="sigil-violation-list">
              {violations.map((v, i) => (
                <li key={i} class={`sigil-violation sigil-${v.severity}`}>
                  <strong>{v.rule}</strong>
                  <p>{v.message}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

interface AnimationPanelProps {
  state: AnimationSummary
  onClose: () => void
}

function AnimationPanel({ state, onClose }: AnimationPanelProps) {
  return (
    <div class="sigil-panel">
      <div class="sigil-panel-header">
        <span>🎭 Animation Inspector</span>
        <button class="sigil-close-btn" onClick={onClose}>{icons.close}</button>
      </div>
      <div class="sigil-panel-content">
        <div class="sigil-animation-status">
          <span class={`sigil-status-badge ${state.isPaused ? 'paused' : 'running'}`}>
            {state.isPaused ? '⏸ Paused' : '▶ Running'}
          </span>
        </div>
        <div class="sigil-animation-stats">
          <div class="sigil-stat">
            <span class="sigil-stat-value">{state.totalAnimations}</span>
            <span class="sigil-stat-label">Total Animations</span>
          </div>
          <div class="sigil-stat">
            <span class="sigil-stat-value">{state.cssAnimations}</span>
            <span class="sigil-stat-label">CSS Animations</span>
          </div>
          <div class="sigil-stat">
            <span class="sigil-stat-value">{state.cssTransitions}</span>
            <span class="sigil-stat-label">CSS Transitions</span>
          </div>
          <div class="sigil-stat">
            <span class="sigil-stat-value">{state.webAnimations}</span>
            <span class="sigil-stat-label">Web Animations</span>
          </div>
        </div>
      </div>
    </div>
  )
}

interface AuditPanelProps {
  audit: CapabilityAudit
  onClose: () => void
}

function AuditPanel({ audit, onClose }: AuditPanelProps) {
  return (
    <div class="sigil-panel sigil-panel-wide">
      <div class="sigil-panel-header">
        <span>♿ Capability Audit</span>
        <button class="sigil-close-btn" onClick={onClose}>{icons.close}</button>
      </div>
      <div class="sigil-panel-content">
        <div class="sigil-audit-summary">
          <span class="sigil-audit-pass">✓ {audit.summary.pass} Pass</span>
          <span class="sigil-audit-warn">⚠ {audit.summary.warn} Warn</span>
          <span class="sigil-audit-fail">✗ {audit.summary.fail} Fail</span>
        </div>
        <ul class="sigil-audit-results">
          {audit.results.map((result, i) => (
            <li key={i} class={`sigil-audit-item sigil-${result.status}`}>
              <span class="sigil-audit-capability">{result.capability}</span>
              <span class="sigil-audit-message">{result.message}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

interface MenuPanelProps {
  onClose: () => void
}

function MenuPanel({ onClose }: MenuPanelProps) {
  const [apiKey, setApiKey] = useState('')
  const [teamId, setTeamId] = useState('')

  useEffect(() => {
    // Load settings
    chrome.runtime.sendMessage({ type: 'GET_SETTINGS' }).then((settings) => {
      if (settings) {
        setApiKey(settings.linearApiKey || '')
        setTeamId(settings.linearTeamId || '')
      }
    })
  }, [])

  const saveSettings = async () => {
    await chrome.runtime.sendMessage({
      type: 'UPDATE_SETTINGS',
      payload: {
        linearApiKey: apiKey,
        linearTeamId: teamId,
      },
    })
    onClose()
  }

  return (
    <div class="sigil-panel">
      <div class="sigil-panel-header">
        <span>≡ Settings</span>
        <button class="sigil-close-btn" onClick={onClose}>{icons.close}</button>
      </div>
      <div class="sigil-panel-content">
        <div class="sigil-form-group">
          <label>Linear API Key</label>
          <input
            type="password"
            value={apiKey}
            onInput={(e) => setApiKey((e.target as HTMLInputElement).value)}
            placeholder="lin_api_..."
          />
        </div>
        <div class="sigil-form-group">
          <label>Linear Team ID</label>
          <input
            type="text"
            value={teamId}
            onInput={(e) => setTeamId((e.target as HTMLInputElement).value)}
            placeholder="TEAM-123"
          />
        </div>
        <button class="sigil-save-btn" onClick={saveSettings}>
          Save Settings
        </button>
        <div class="sigil-shortcuts">
          <h4>Keyboard Shortcuts</h4>
          <ul>
            <li><kbd>Alt+Shift+P</kbd> Physics Inspector</li>
            <li><kbd>Alt+Shift+A</kbd> Toggle Animations</li>
            <li><kbd>Alt+Shift+C</kbd> Capability Audit</li>
            <li><kbd>Alt+Shift+S</kbd> Screenshot</li>
            <li><kbd>Alt+Shift+N</kbd> Annotate</li>
            <li><kbd>Esc</kbd> Close Panel</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Mount/Unmount
// ============================================================================

let container: HTMLDivElement | null = null

export function createToolbar(): void {
  if (container) return

  container = document.createElement('div')
  container.id = 'sigil-toolbar-root'
  document.body.appendChild(container)

  render(<Toolbar />, container)
  console.log('[Sigil] Toolbar created')
}

export function destroyToolbar(): void {
  if (!container) return

  render(null, container)
  container.remove()
  container = null
  console.log('[Sigil] Toolbar destroyed')
}

export function toggleToolbar(): void {
  if (container) {
    destroyToolbar()
  } else {
    createToolbar()
  }
}
