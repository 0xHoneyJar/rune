'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { TierBadge } from '@/components/TierBadge'
import { IntentBadge } from '@/components/IntentBadge'
import { Playground } from '@/components/Playground'
import { getComponentByName } from '@/lib/components'
import type { SigilComponent } from '@/lib/types'

export default function ComponentDetailPage() {
  const params = useParams()
  const name = decodeURIComponent(params.name as string)
  const [component, setComponent] = useState<SigilComponent | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadComponent() {
      setLoading(true)
      const data = await getComponentByName(name)
      setComponent(data || null)
      setLoading(false)
    }
    loadComponent()
  }, [name])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-slate-600"></div>
        </div>
      </div>
    )
  }

  if (!component) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🔍</div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Component not found
          </h2>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            "{name}" doesn't exist in the showcase
          </p>
          <Link
            href="/showcase"
            className="mt-4 inline-block text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
          >
            ← Back to showcase
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <Link
          href="/showcase"
          className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-sm"
        >
          ← Back to showcase
        </Link>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            {component.name}
          </h1>
          <TierBadge tier={component.tier} />
        </div>
        <IntentBadge intent={component.intent} />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Taste Data */}
        <div className="space-y-6">
          {/* Problem */}
          {component.description && (
            <section>
              <h2 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                Problem Solved
              </h2>
              <p className="text-slate-700 dark:text-slate-300">
                {component.description}
              </p>
            </section>
          )}

          {/* Feel */}
          {component.feel && (
            <section>
              <h2 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                Feel
              </h2>
              <blockquote className="border-l-4 border-slate-300 dark:border-slate-600 pl-4 italic text-slate-700 dark:text-slate-300">
                "{component.feel}"
              </blockquote>
            </section>
          )}

          {/* Rejected */}
          {component.rejected.length > 0 && (
            <section>
              <h2 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                Rejected Patterns
              </h2>
              <ul className="space-y-1">
                {component.rejected.map((r, i) => (
                  <li
                    key={i}
                    className="flex items-center text-sm text-red-600 dark:text-red-400"
                  >
                    <span className="mr-2">✗</span>
                    {r}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Inspiration */}
          {component.inspiration.length > 0 && (
            <section>
              <h2 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                Inspiration
              </h2>
              <ul className="space-y-1">
                {component.inspiration.map((i, idx) => (
                  <li
                    key={idx}
                    className="flex items-center text-sm text-slate-700 dark:text-slate-300"
                  >
                    <span className="mr-2">✦</span>
                    {i}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Gold Details */}
          {component.tier === 'gold' && (
            <>
              {component.owner && (
                <section>
                  <h2 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                    Taste Owner
                  </h2>
                  <p className="text-slate-700 dark:text-slate-300">
                    👤 {component.owner}
                  </p>
                </section>
              )}

              {component.graduatedAt && (
                <section>
                  <h2 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                    Graduated
                  </h2>
                  <p className="text-slate-700 dark:text-slate-300">
                    {component.graduatedAt}
                  </p>
                </section>
              )}
            </>
          )}

          {/* Source File */}
          <section>
            <h2 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
              Source
            </h2>
            <code className="text-sm font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-700 dark:text-slate-300">
              {component.file}
            </code>
          </section>
        </div>

        {/* Right Column - Playground */}
        <div>
          <h2 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
            Live Playground
          </h2>
          <Playground component={component} />
        </div>
      </div>
    </div>
  )
}
