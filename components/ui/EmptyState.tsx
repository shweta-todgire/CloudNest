'use client'
import { Upload, Star, Trash2, Search } from 'lucide-react'

interface Props {
  section: string
  onUpload?: () => void
}

const states: Record<string, { icon: string; title: string; sub: string }> = {
  'my-drive': { icon: '📂', title: 'Your drive is empty', sub: 'Upload files or create a folder to get started' },
  'starred': { icon: '⭐', title: 'No starred files', sub: 'Star important files to find them quickly' },
  'trash': { icon: '🗑️', title: 'Trash is empty', sub: 'Files you delete will appear here' },
  'search': { icon: '🔍', title: 'No results found', sub: 'Try a different search term' },
}

export function EmptyState({ section, onUpload }: Props) {
  const state = states[section] ?? states['my-drive']

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-24 animate-fade-in">
      <div className="text-6xl mb-4">{state.icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{state.title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-xs">{state.sub}</p>
      {section === 'my-drive' && onUpload && (
        <button
          onClick={onUpload}
          className="mt-6 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors shadow-sm"
        >
          <Upload className="w-4 h-4" />
          Upload your first file
        </button>
      )}
    </div>
  )
}
