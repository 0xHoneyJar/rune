'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { NorthStarCard } from '@/components/NorthStarCard'
import { CoreFeelTable } from '@/components/CoreFeelTable'
import { AntiPatternList } from '@/components/AntiPatternList'
import { FeatureCard } from '@/components/FeatureCard'
import {
  getProductMoodboard,
  getMoodboardStats,
} from '@/lib/moodboards'
import type { ProductMoodboard } from '@/lib/types'

export default function MoodboardPage() {
  const [moodboard, setMoodboard] = useState<ProductMoodboard | null>(null)
  const [stats, setStats] = useState({ hasProduct: false, featureCount: 0, activeFeatures: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const [product, moodboardStats] = await Promise.all([
          getProductMoodboard(),
          getMoodboardStats(),
        ])
        setMoodboard(product)
        setStats(moodboardStats)
      } catch (error) {
        console.error('Failed to load moodboard:', error)
      }
      setLoading(false)
    }
    loadData()
  }, [])

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
          <div className="text-4xl mb-4">🎨</div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            No moodboard yet
          </h2>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Create your product moodboard with <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">/sigil moodboard</code>
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
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">🎨</span>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            {moodboard.product} Moodboard
          </h1>
        </div>
        <p className="text-slate-600 dark:text-slate-400">
          The soul of the product - north stars, core feelings, and anti-patterns.
        </p>

        {/* Stats */}
        <div className="mt-4 flex gap-4 text-sm">
          <span className="text-slate-500 dark:text-slate-400">
            Created: <span className="font-medium text-slate-700 dark:text-slate-300">{moodboard.created}</span>
          </span>
          <span className="text-slate-500 dark:text-slate-400">
            Features: <span className="font-medium text-slate-700 dark:text-slate-300">{stats.featureCount}</span>
          </span>
        </div>
      </div>

      {/* North Stars */}
      <section className="mb-8">
        <h2 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-4">
          North Stars
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <NorthStarCard type="games" items={moodboard.northStars.games} />
          <NorthStarCard type="products" items={moodboard.northStars.products} />
        </div>
      </section>

      {/* Core Feelings */}
      <section className="mb-8">
        <h2 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-4">
          Core Feelings
        </h2>
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
          <CoreFeelTable feels={moodboard.coreFeels} />
        </div>
      </section>

      {/* Anti-Patterns */}
      <section className="mb-8">
        <AntiPatternList patterns={moodboard.antiPatterns} />
      </section>

      {/* Feature Moodboards */}
      {moodboard.features.length > 0 && (
        <section>
          <h2 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-4">
            Feature Moodboards
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {moodboard.features.map((feature) => (
              <FeatureCard
                key={feature.name}
                name={feature.name}
                status={feature.status}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
