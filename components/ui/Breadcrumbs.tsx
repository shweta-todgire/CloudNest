'use client'
import { ChevronRight, Home } from 'lucide-react'
import { useDriveStore } from '@/store/driveStore'
import { cn } from '@/lib/utils'

export function Breadcrumbs() {
  const { breadcrumbs, navigateToBreadcrumb, activeSection } = useDriveStore()

  const sectionLabel: Record<string, string> = {
    'my-drive': 'My Drive',
    'starred': 'Starred',
    'trash': 'Trash',
    'search': 'Search Results',
  }

  if (activeSection !== 'my-drive') {
    return (
      <div className="flex items-center gap-2 mb-1">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          {sectionLabel[activeSection]}
        </h1>
      </div>
    )
  }

  return (
    <nav className="flex items-center gap-1 text-sm mb-1 flex-wrap">
      {breadcrumbs.map((crumb, i) => (
        <div key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />}
          <button
            onClick={() => navigateToBreadcrumb(i)}
            className={cn(
              'flex items-center gap-1.5 px-2 py-1 rounded-lg transition-colors',
              i === breadcrumbs.length - 1
                ? 'font-bold text-gray-900 dark:text-white cursor-default'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800',
            )}
          >
            {i === 0 && <Home className="w-3.5 h-3.5" />}
            {crumb.name}
          </button>
        </div>
      ))}
    </nav>
  )
}
