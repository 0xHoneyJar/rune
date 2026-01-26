/**
 * Agentation Theme Constants
 *
 * Design tokens for consistent styling. Simplified from sigil-hud.
 */

/**
 * Color palette
 */
export const colors = {
  // Brand
  primary: '#10b981',
  primaryLight: 'rgba(16, 185, 129, 0.2)',
  primaryBorder: 'rgba(16, 185, 129, 0.3)',

  // Status
  success: '#22c55e',
  error: '#ef4444',
  warning: '#eab308',

  // Neutral
  text: '#fff',
  textMuted: '#888',
  textDim: '#666',

  background: 'rgba(0, 0, 0, 0.9)',
  backgroundHover: 'rgba(255, 255, 255, 0.05)',
  backgroundInput: 'rgba(255, 255, 255, 0.02)',

  border: 'rgba(255, 255, 255, 0.1)',
  borderSubtle: 'rgba(255, 255, 255, 0.05)',
} as const

/**
 * Spacing
 */
export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
} as const

/**
 * Border radius
 */
export const radii = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  full: '9999px',
} as const

/**
 * Shadows
 */
export const shadows = {
  md: '0 4px 12px rgba(0, 0, 0, 0.3)',
  primary: '0 4px 12px rgba(16, 185, 129, 0.3)',
} as const

/**
 * Z-index
 */
export const zIndex = {
  fixed: 5000,
  modal: 10000,
} as const

/**
 * Theme object for easy access
 */
export const theme = {
  colors,
  spacing,
  radii,
  shadows,
  zIndex,
} as const
