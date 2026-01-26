/**
 * Lens Service Implementation
 *
 * Provides lens functionality for non-React contexts.
 */

import { useLensStore, getLensState } from '../store/lens'
import type { LensState, SavedAddress, Address } from '../types'
import type { LensContext } from './hooks'

/**
 * Lens service interface for non-React usage
 */
export interface LensService {
  getState(): LensState
  setImpersonatedAddress(address: Address): void
  clearImpersonation(): void
  setRealAddress(address: Address | null): void
  saveAddress(entry: Omit<SavedAddress, 'addedAt'>): void
  removeAddress(address: Address): void
  getContext(): LensContext
  subscribe(listener: (state: LensState) => void): () => void
}

/**
 * Create a lens service
 */
export function createLensService(): LensService {
  const store = useLensStore

  return {
    getState(): LensState {
      return getLensState()
    },

    setImpersonatedAddress(address: Address): void {
      store.getState().setImpersonatedAddress(address)
    },

    clearImpersonation(): void {
      store.getState().clearImpersonation()
    },

    setRealAddress(address: Address | null): void {
      store.getState().setRealAddress(address)
    },

    saveAddress(entry: Omit<SavedAddress, 'addedAt'>): void {
      store.getState().saveAddress(entry)
    },

    removeAddress(address: Address): void {
      store.getState().removeAddress(address)
    },

    getContext(): LensContext {
      const state = getLensState()
      return {
        isImpersonating: state.enabled && state.impersonatedAddress !== null,
        impersonatedAddress: state.impersonatedAddress,
        realAddress: state.realAddress,
      }
    },

    subscribe(listener: (state: LensState) => void): () => void {
      return store.subscribe((state) => {
        listener({
          enabled: state.enabled,
          impersonatedAddress: state.impersonatedAddress,
          realAddress: state.realAddress,
          savedAddresses: state.savedAddresses,
        })
      })
    },
  }
}

/**
 * Default lens service singleton
 */
let defaultLensService: LensService | null = null

/**
 * Get the default lens service
 */
export function getLensService(): LensService {
  if (!defaultLensService) {
    defaultLensService = createLensService()
  }
  return defaultLensService
}

/**
 * Reset the default lens service
 */
export function resetLensService(): void {
  if (defaultLensService) {
    useLensStore.getState().reset()
  }
  defaultLensService = null
}
