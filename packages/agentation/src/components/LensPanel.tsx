/**
 * Lens Panel Component
 *
 * Panel for address impersonation controls.
 */

import { useState, useCallback } from 'react'
import { useLensStore } from '../store/lens'
import { colors, spacing, radii } from '../theme'
import type { Address } from '../types'

/**
 * Lens panel for address impersonation
 */
export function LensPanel() {
  const [inputAddress, setInputAddress] = useState('')
  const [inputLabel, setInputLabel] = useState('')

  // Get state from store
  const enabled = useLensStore((state) => state.enabled)
  const impersonatedAddress = useLensStore((state) => state.impersonatedAddress)
  const realAddress = useLensStore((state) => state.realAddress)
  const savedAddresses = useLensStore((state) => state.savedAddresses)
  const setImpersonatedAddress = useLensStore((state) => state.setImpersonatedAddress)
  const clearImpersonation = useLensStore((state) => state.clearImpersonation)
  const saveAddress = useLensStore((state) => state.saveAddress)

  const isImpersonating = enabled && impersonatedAddress !== null

  // Handle impersonation
  const handleImpersonate = useCallback(() => {
    if (!inputAddress) return

    // Basic validation
    if (!/^0x[a-fA-F0-9]{40}$/.test(inputAddress)) {
      alert('Invalid address format')
      return
    }

    setImpersonatedAddress(inputAddress as Address)
    setInputAddress('')
  }, [inputAddress, setImpersonatedAddress])

  // Handle save address
  const handleSaveAddress = useCallback(() => {
    if (!inputAddress || !inputLabel) return

    saveAddress({
      address: inputAddress as Address,
      label: inputLabel,
    })
    setInputAddress('')
    setInputLabel('')
  }, [inputAddress, inputLabel, saveAddress])

  // Handle stop impersonation
  const handleStopImpersonation = useCallback(() => {
    clearImpersonation()
  }, [clearImpersonation])

  return (
    <div style={{ padding: spacing.lg }}>
      {/* Current Status */}
      <div style={{ marginBottom: spacing.lg }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing.sm,
            marginBottom: spacing.sm,
          }}
        >
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: radii.full,
              backgroundColor: isImpersonating ? colors.primary : colors.textDim,
            }}
          />
          <span style={{ color: isImpersonating ? colors.primary : colors.textMuted }}>
            {isImpersonating ? 'Impersonating' : 'Not impersonating'}
          </span>
        </div>

        {isImpersonating && (
          <div style={{ marginLeft: spacing.lg }}>
            <code
              style={{
                fontSize: '11px',
                color: colors.primary,
                wordBreak: 'break-all',
              }}
            >
              {impersonatedAddress}
            </code>
            <button
              onClick={handleStopImpersonation}
              style={{
                display: 'block',
                marginTop: spacing.sm,
                padding: `${spacing.xs} ${spacing.sm}`,
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: radii.sm,
                color: colors.error,
                fontSize: '10px',
                cursor: 'pointer',
              }}
            >
              Stop Impersonation
            </button>
          </div>
        )}

        {realAddress && (
          <div style={{ marginTop: spacing.sm, color: colors.textDim, fontSize: '10px' }}>
            Real: {realAddress.slice(0, 6)}...{realAddress.slice(-4)}
          </div>
        )}
      </div>

      {/* Impersonate Address */}
      <div style={{ marginBottom: spacing.lg }}>
        <label
          style={{
            display: 'block',
            color: colors.textMuted,
            fontSize: '10px',
            marginBottom: spacing.xs,
          }}
        >
          Impersonate Address
        </label>
        <input
          type="text"
          value={inputAddress}
          onChange={(e) => setInputAddress(e.target.value)}
          placeholder="0x..."
          style={{
            width: '100%',
            padding: spacing.sm,
            backgroundColor: colors.backgroundInput,
            border: `1px solid ${colors.border}`,
            borderRadius: radii.sm,
            color: colors.text,
            fontSize: '11px',
            fontFamily: 'ui-monospace, monospace',
            boxSizing: 'border-box',
          }}
        />
        <div style={{ display: 'flex', gap: spacing.sm, marginTop: spacing.sm }}>
          <button
            onClick={handleImpersonate}
            disabled={!inputAddress}
            style={{
              flex: 1,
              padding: `6px ${spacing.md}`,
              backgroundColor: inputAddress ? colors.primaryLight : colors.backgroundHover,
              border: `1px solid ${colors.primaryBorder}`,
              borderRadius: radii.sm,
              color: inputAddress ? colors.primary : colors.textDim,
              fontSize: '11px',
              cursor: inputAddress ? 'pointer' : 'not-allowed',
            }}
          >
            Impersonate
          </button>
        </div>
      </div>

      {/* Save Address */}
      <div style={{ marginBottom: spacing.lg }}>
        <label
          style={{
            display: 'block',
            color: colors.textMuted,
            fontSize: '10px',
            marginBottom: spacing.xs,
          }}
        >
          Save with Label
        </label>
        <input
          type="text"
          value={inputLabel}
          onChange={(e) => setInputLabel(e.target.value)}
          placeholder="Label (e.g., Whale)"
          style={{
            width: '100%',
            padding: spacing.sm,
            backgroundColor: colors.backgroundInput,
            border: `1px solid ${colors.border}`,
            borderRadius: radii.sm,
            color: colors.text,
            fontSize: '11px',
            marginBottom: spacing.sm,
            boxSizing: 'border-box',
          }}
        />
        <button
          onClick={handleSaveAddress}
          disabled={!inputAddress || !inputLabel}
          style={{
            width: '100%',
            padding: `6px ${spacing.md}`,
            backgroundColor:
              inputAddress && inputLabel ? 'rgba(59, 130, 246, 0.2)' : colors.backgroundHover,
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: radii.sm,
            color: inputAddress && inputLabel ? '#3b82f6' : colors.textDim,
            fontSize: '11px',
            cursor: inputAddress && inputLabel ? 'pointer' : 'not-allowed',
          }}
        >
          Save Address
        </button>
      </div>

      {/* Saved Addresses */}
      {savedAddresses.length > 0 && (
        <div>
          <label
            style={{
              display: 'block',
              color: colors.textMuted,
              fontSize: '10px',
              marginBottom: spacing.sm,
            }}
          >
            Saved Addresses
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
            {savedAddresses.map((saved) => (
              <button
                key={saved.address}
                onClick={() => setImpersonatedAddress(saved.address)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: spacing.sm,
                  backgroundColor: colors.backgroundInput,
                  border: `1px solid ${colors.borderSubtle}`,
                  borderRadius: radii.sm,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span style={{ color: colors.text, fontSize: '11px' }}>{saved.label}</span>
                <code style={{ color: colors.textDim, fontSize: '10px' }}>
                  {saved.address.slice(0, 6)}...{saved.address.slice(-4)}
                </code>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
