'use client'
import { Loader2 } from 'lucide-react'
import { useDriveStore } from '@/store/driveStore'
import { FileGrid } from './FileGrid'
import { FileList } from './FileList'
import { EmptyState } from './EmptyState'

export function SearchResults() {
  const { searchQuery, searchResults, isSearching, viewMode } = useDriveStore()

  if (isSearching) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
        <p className="text-sm text-gray-500 dark:text-gray-400">Searching…</p>
      </div>
    )
  }

  if (searchResults.length === 0) {
    return <EmptyState section="search" />
  }

  return (
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
        {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for{' '}
        <span className="font-semibold text-gray-900 dark:text-white">"{searchQuery}"</span>
      </p>
      {viewMode === 'grid' ? (
        <FileGrid files={searchResults} />
      ) : (
        <FileList files={searchResults} />
      )}
    </div>
  )
}
