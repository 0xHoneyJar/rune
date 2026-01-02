import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Sigil Showcase',
  description: 'Component taste showcase - see the guild\'s finest work',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-white dark:bg-slate-900">
        <nav className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <a href="/" className="flex items-center space-x-2">
                  <span className="text-2xl">🔮</span>
                  <span className="font-bold text-xl text-slate-900 dark:text-white">
                    Sigil
                  </span>
                </a>
                <nav className="ml-10 flex items-center space-x-4">
                  <a
                    href="/showcase"
                    className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-3 py-2 text-sm font-medium"
                  >
                    Components
                  </a>
                  <a
                    href="/moodboard"
                    className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-3 py-2 text-sm font-medium"
                  >
                    Moodboard
                  </a>
                </nav>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  v0.1.0
                </span>
              </div>
            </div>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  )
}
