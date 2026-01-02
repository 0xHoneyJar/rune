interface CoreFeel {
  context: string
  feel: string
  reference?: string
}

interface CoreFeelTableProps {
  feels: CoreFeel[]
}

export function CoreFeelTable({ feels }: CoreFeelTableProps) {
  if (feels.length === 0) {
    return null
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-700">
            <th className="text-left py-2 pr-4 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Context
            </th>
            <th className="text-left py-2 pr-4 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Feel
            </th>
            <th className="text-left py-2 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Reference
            </th>
          </tr>
        </thead>
        <tbody>
          {feels.map((feel, i) => (
            <tr
              key={i}
              className="border-b border-slate-100 dark:border-slate-800"
            >
              <td className="py-3 pr-4 font-medium text-slate-900 dark:text-white">
                {feel.context}
              </td>
              <td className="py-3 pr-4 italic text-slate-700 dark:text-slate-300">
                {feel.feel}
              </td>
              <td className="py-3 text-slate-500 dark:text-slate-400">
                {feel.reference || '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
