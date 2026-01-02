import Link from 'next/link'

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-6xl">
          <span className="text-5xl sm:text-7xl">🔮</span>
          <br />
          Sigil Showcase
        </h1>
        <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">
          See the guild's finest work. Browse components by taste, explore design decisions,
          and understand the craftsmanship behind each interaction.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/showcase"
            className="rounded-md bg-slate-900 dark:bg-white px-6 py-3 text-sm font-semibold text-white dark:text-slate-900 shadow-sm hover:bg-slate-700 dark:hover:bg-slate-100 transition-colors"
          >
            Browse Components
          </Link>
        </div>
      </div>

      <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-gold-100 text-2xl">
            🏆
          </div>
          <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
            Gold Tier
          </h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Production-proven components with physics, ownership, and battle scars.
          </p>
        </div>

        <div className="text-center">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-silver-100 text-2xl">
            🥈
          </div>
          <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
            Silver Tier
          </h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Captured taste with feel, rejection, and inspiration documented.
          </p>
        </div>

        <div className="text-center">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-slate-100 text-2xl">
            📝
          </div>
          <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
            JTBD Labels
          </h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Every component maps to a Job-To-Be-Done from Eileen's vocabulary.
          </p>
        </div>
      </div>
    </div>
  )
}
