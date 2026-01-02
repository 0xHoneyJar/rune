'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { clsx } from 'clsx'
import { getFeatureMoodboard } from '@/lib/moodboards'
import type { FeatureMoodboard, MoodboardStatus } from '@/lib/types'

const statusConfig: Record<
  MoodboardStatus,
  { label: string; className: string }
> = {
  active: {
    label: 'Active',
    className:
      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  },
  draft: {
    label: 'Draft',
    className:
      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  },
  deprecated: {
    label: 'Deprecated',
    className:
      'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
  },
}

export default function FeatureMoodboardPage() {
  const params = useParams()
  const feature = decodeURIComponent(params.feature as string)
  const [moodboard, setMoodboard] = useState<FeatureMoodboard | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      const data = await getFeatureMoodboard(feature)
      setMoodboard(data)
      setLoading(false)
    }
    loadData()
  }, [feature])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-slate-600"></div>
        </div>
      </div>
    )
  }

  if (!moodboard) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🔍</div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Feature moodboard not found
          </h2>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            "{feature}" doesn't exist in the moodboards
          </p>
          <Link
            href="/moodboard"
            className="mt-4 inline-block text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
          >
            ← Back to moodboard
          </Link>
        </div>
      </div>
    )
  }

  const statusStyle = statusConfig[moodboard.status]

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <Link
          href="/moodboard"
          className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-sm"
        >
          ← Back to product moodboard
        </Link>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white capitalize">
            {moodboard.feature.replace(/-/g, ' ')}
          </h1>
          <span
            className={clsx(
              'text-sm px-3 py-1 rounded-full font-medium',
              statusStyle.className
            )}
          >
            {statusStyle.label}
          </span>
        </div>
        <p className="text-slate-600 dark:text-slate-400">
          Feature moodboard for {moodboard.product}
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
          Created: {moodboard.created}
        </p>
      </div>

      {/* Primary Feel */}
      <section className="mb-8">
        <h2 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
          Primary Feel
        </h2>
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
          <blockquote className="text-lg italic text-slate-700 dark:text-slate-300 border-l-4 border-slate-300 dark:border-slate-600 pl-4">
            "{moodboard.primaryFeel}"
          </blockquote>
        </div>
      </section>

      {/* Anti-Feels */}
      {moodboard.antiFeels.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
            Anti-Feels
          </h2>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <ul className="space-y-2">
              {moodboard.antiFeels.map((feel, i) => (
                <li
                  key={i}
                  className="text-sm text-red-700 dark:text-red-300 flex items-center"
                >
                  <span className="mr-2 text-red-400">✗</span>
                  {feel}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Components */}
      {moodboard.components && moodboard.components.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
            Related Components
          </h2>
          <div className="flex flex-wrap gap-2">
            {moodboard.components.map((component, i) => (
              <Link
                key={i}
                href={`/showcase/${encodeURIComponent(component)}`}
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                {component}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
