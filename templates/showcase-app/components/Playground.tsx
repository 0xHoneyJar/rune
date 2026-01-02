'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { SigilComponent } from '@/lib/types'

interface PlaygroundProps {
  component: SigilComponent
}

type ComponentState = 'default' | 'hover' | 'loading' | 'success' | 'error'

const stateLabels: Record<ComponentState, string> = {
  default: 'Default',
  hover: 'Hover',
  loading: 'Loading',
  success: 'Success',
  error: 'Error',
}

export function Playground({ component }: PlaygroundProps) {
  const [activeState, setActiveState] = useState<ComponentState>('default')

  // Parse physics parameters if available
  const physicsParams = component.physics
    ? parsePhysics(component.physics)
    : { stiffness: 100, damping: 10 }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Preview Area */}
      <div className="p-8 bg-slate-50 dark:bg-slate-900 min-h-[200px] flex items-center justify-center">
        <motion.div
          className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-medium cursor-pointer"
          initial={{ scale: 1 }}
          animate={getStateAnimation(activeState, physicsParams)}
          transition={{
            type: 'spring',
            stiffness: physicsParams.stiffness,
            damping: physicsParams.damping,
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {component.name}
          {activeState === 'loading' && (
            <span className="ml-2 inline-block animate-spin">⟳</span>
          )}
          {activeState === 'success' && <span className="ml-2">✓</span>}
          {activeState === 'error' && <span className="ml-2">✗</span>}
        </motion.div>
      </div>

      {/* Controls */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700">
        <div className="mb-4">
          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
            State
          </label>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(stateLabels) as ComponentState[]).map((state) => (
              <button
                key={state}
                onClick={() => setActiveState(state)}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  activeState === state
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                {stateLabels[state]}
              </button>
            ))}
          </div>
        </div>

        {/* Physics Display (Gold only) */}
        {component.tier === 'gold' && component.physics && (
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
              Physics Parameters
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-slate-500">Stiffness</span>
                <div className="font-mono text-sm text-slate-900 dark:text-white">
                  {physicsParams.stiffness}
                </div>
              </div>
              <div>
                <span className="text-xs text-slate-500">Damping</span>
                <div className="font-mono text-sm text-slate-900 dark:text-white">
                  {physicsParams.damping}
                </div>
              </div>
            </div>
            <div className="mt-2">
              <span className="text-xs text-slate-500">Raw</span>
              <pre className="mt-1 text-xs font-mono bg-slate-100 dark:bg-slate-900 p-2 rounded overflow-x-auto">
                {component.physics}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function parsePhysics(physics: string): { stiffness: number; damping: number } {
  // Parse physics string like "spring: 120, 14" or "stiffness: 120, damping: 14"
  const numbers = physics.match(/\d+/g)
  if (numbers && numbers.length >= 2) {
    return {
      stiffness: parseInt(numbers[0], 10),
      damping: parseInt(numbers[1], 10),
    }
  }
  return { stiffness: 100, damping: 10 }
}

function getStateAnimation(
  state: ComponentState,
  physics: { stiffness: number; damping: number }
) {
  switch (state) {
    case 'hover':
      return { scale: 1.05, y: -2 }
    case 'loading':
      return { opacity: 0.7 }
    case 'success':
      return { scale: 1.1, backgroundColor: '#22c55e' }
    case 'error':
      return { scale: 0.95, x: [0, -5, 5, -5, 5, 0] }
    default:
      return { scale: 1, opacity: 1, y: 0 }
  }
}
