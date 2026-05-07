'use client'
import { useEffect, useRef, useState } from 'react'
import { Search, X, Grid, List, SortAsc, SortDesc, Moon, Sun } from 'lucide-react'
import { useDriveStore } from '@/store/driveStore'
import { searchFiles } from '@/lib/fileOperations'
import { cn } from '@/lib/utils'

export function Header() {
  const {
    user, viewMode, setViewMode, searchQuery, setSearchQuery,
    setSearchResults, setIsSearching, setActiveSection, filter, setFilter,
  } = useDriveStore()

  const [dark, setDark] = useState(false)
  const searchTimeout = useRef<ReturnType<typeof setTimeout>>()

  // Toggle dark mode
  useEffect(() => {
    const root = document.documentElement
    dark ? root.classList.add('dark') : root.classList.remove('dark')
  }, [dark])

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    clearTimeout(searchTimeout.current)
    if (!value.trim()) {
      setActiveSection('my-drive')
      setSearchResults([])
      return
    }
    setActiveSection('search')
    setIsSearching(true)
    searchTimeout.current = setTimeout(async () => {
      if (!user) return
      const results = await searchFiles(user.uid, value)
      setSearchResults(results)
      setIsSearching(false)
    }, 400)
  }

  const clearSearch = () => {
    setSearchQuery('')
    setSearchResults([])
    setActiveSection('my-drive')
  }

  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'date', label: 'Date' },
    { value: 'size', label: 'Size' },
  ] as const

  return (
    <header className="flex items-center gap-4 px-6 py-3.5 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 shrink-0">
      {/* Search */}
      <div className="flex-1 max-w-xl relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search files and folders…"
          className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
        {searchQuery && (
          <button onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full">
            <X className="w-3.5 h-3.5 text-gray-500" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Sort */}
        <select
          value={filter.sortBy}
          onChange={(e) => setFilter({ sortBy: e.target.value as any })}
          className="text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-2.5 py-2 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        <button
          onClick={() => setFilter({ sortOrder: filter.sortOrder === 'asc' ? 'desc' : 'asc' })}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
          title={`Sort ${filter.sortOrder === 'asc' ? 'descending' : 'ascending'}`}
        >
          {filter.sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
        </button>

        {/* View toggle */}
        <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
          <button
            onClick={() => setViewMode('grid')}
            className={cn('p-1.5 rounded-md transition-all', viewMode === 'grid' ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400')}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={cn('p-1.5 rounded-md transition-all', viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400')}
          >
            <List className="w-4 h-4" />
          </button>
        </div>

        {/* Dark mode */}
        <button
          onClick={() => setDark(!dark)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
        >
          {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  )
}
