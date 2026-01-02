'use client'

import { useState } from 'react'
import type { Tier, ComponentFilter as FilterType } from '@/lib/types'

interface ComponentFilterProps {
  intents: string[]
  onFilterChange: (filter: FilterType) => void
  currentFilter: FilterType
}

export function ComponentFilter({
  intents,
  onFilterChange,
  currentFilter,
}: ComponentFilterProps) {
  const [search, setSearch] = useState(currentFilter.search || '')

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    onFilterChange({ ...currentFilter, search: e.target.value })
  }

  const handleTierChange = (tier: Tier | 'all') => {
    onFilterChange({ ...currentFilter, tier })
  }

  const handleIntentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...currentFilter, intent: e.target.value || undefined })
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <label
            htmlFor="search"
            className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1"
          >
            Search
          </label>
          <input
            type="text"
            id="search"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search components..."
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500"
          />
        </div>

        {/* Tier Filter */}
        <div>
          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
            Tier
          </label>
          <div className="flex rounded-md overflow-hidden border border-slate-200 dark:border-slate-700">
            {(['all', 'gold', 'silver'] as const).map((tier) => (
              <button
                key={tier}
                onClick={() => handleTierChange(tier)}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  currentFilter.tier === tier ||
                  (tier === 'all' && !currentFilter.tier)
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                    : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {tier === 'all' ? 'All' : tier === 'gold' ? '🏆 Gold' : '🥈 Silver'}
              </button>
            ))}
          </div>
        </div>

        {/* Intent Filter */}
        <div>
          <label
            htmlFor="intent"
            className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1"
          >
            Intent
          </label>
          <select
            id="intent"
            value={currentFilter.intent || ''}
            onChange={handleIntentChange}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-500"
          >
            <option value="">All Intents</option>
            {intents.map((intent) => (
              <option key={intent} value={intent}>
                {intent}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
