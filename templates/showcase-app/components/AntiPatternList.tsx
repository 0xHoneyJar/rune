interface AntiPatternListProps {
  patterns: string[]
}

export function AntiPatternList({ patterns }: AntiPatternListProps) {
  if (patterns.length === 0) {
    return null
  }

  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">🚫</span>
        <h3 className="font-medium text-red-900 dark:text-red-100">
          Anti-Patterns
        </h3>
      </div>
      <ul className="space-y-2">
        {patterns.map((pattern, i) => (
          <li
            key={i}
            className="text-sm text-red-700 dark:text-red-300 flex items-center"
          >
            <span className="mr-2 text-red-400">✗</span>
            {pattern}
          </li>
        ))}
      </ul>
    </div>
  )
}
