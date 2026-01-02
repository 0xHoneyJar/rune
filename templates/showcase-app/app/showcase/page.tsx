'use client'

import { useState, useEffect } from 'react'
import { ComponentCard } from '@/components/ComponentCard'
import { ComponentFilter } from '@/components/ComponentFilter'
import { filterComponents, getUniqueIntents, getTierStats } from '@/lib/components'
import type { SigilComponent, ComponentFilter as FilterType } from '@/lib/types'

export default function ShowcasePage() {
  const [components, setComponents] = useState<SigilComponent[]>([])
  const [intents, setIntents] = useState<string[]>([])
  const [stats, setStats] = useState({ total: 0, gold: 0, silver: 0, uncaptured: 0 })
  const [filter, setFilter] = useState<FilterType>({ tier: 'all' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const [filteredComponents, uniqueIntents, tierStats] = await Promise.all([
          filterComponents(filter),
          getUniqueIntents(),
          getTierStats(),
        ])
        setComponents(filteredComponents)
        setIntents(uniqueIntents)
        setStats(tierStats)
      } catch (error) {
        console.error('Failed to load components:', error)
      }
      setLoading(false)
    }
    loadData()
  }, [filter])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Component Showcase
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Browse captured component taste. Each component tells a story of intentional design.
        </p>

        {/* Stats */}
        <div className="mt-4 flex gap-4 text-sm">
          <span className="text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-slate-900 dark:text-white">
              {stats.total}
            </span>{' '}
            total
          </span>
          <span className="text-gold-600 dark:text-gold-400">
            <span className="font-semibold">{stats.gold}</span> gold
          </span>
          <span className="text-silver-600 dark:text-silver-400">
            <span className="font-semibold">{stats.silver}</span> silver
          </span>
        </div>
      </div>

      {/* Filters */}
      <ComponentFilter
        intents={intents}
        onFilterChange={setFilter}
        currentFilter={filter}
      />

      {/* Component Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-200 dark:border-slate-700 border-t-slate-600 dark:border-t-slate-300"></div>
          <p className="mt-4 text-slate-500 dark:text-slate-400">
            Loading components...
          </p>
        </div>
      ) : components.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🔮</div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-white">
            No components found
          </h3>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            {filter.search || filter.intent
              ? 'Try adjusting your filters'
              : 'Run /sigil export to generate component data'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {components.map((component) => (
            <ComponentCard key={component.name} component={component} />
          ))}
        </div>
      )}
    </div>
  )
}
