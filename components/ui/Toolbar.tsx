'use client'
import { Upload, FolderPlus, Trash2, Download, Star, X, CheckSquare } from 'lucide-react'
import { useDriveStore } from '@/store/driveStore'
import { toggleStar, moveToTrash } from '@/lib/fileOperations'
import toast from 'react-hot-toast'
import { useRef } from 'react'
import { useUpload } from '@/hooks/useUpload'

interface Props {
  onUploadClick: () => void
}

export function Toolbar({ onUploadClick }: Props) {
  const {
    selectedFiles, files, clearSelection, selectAll,
    setNewFolderModal, activeSection,
  } = useDriveStore()
  const { upload } = useUpload()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const selectedCount = selectedFiles.size

  const handleStarSelected = async () => {
    const selected = files.filter((f) => selectedFiles.has(f.id))
    await Promise.all(selected.map((f) => toggleStar(f.id, f.isStarred)))
    toast.success(`Starred ${selectedCount} item${selectedCount > 1 ? 's' : ''}`)
    clearSelection()
  }

  const handleTrashSelected = async () => {
    const selected = files.filter((f) => selectedFiles.has(f.id))
    await Promise.all(selected.map((f) => moveToTrash(f.id)))
    toast.success(`Moved ${selectedCount} item${selectedCount > 1 ? 's' : ''} to trash`)
    clearSelection()
  }

  if (selectedCount > 0) {
    return (
      <div className="flex items-center gap-2 py-2 animate-slide-in">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-1">
          {selectedCount} selected
        </span>
        <button
          onClick={handleStarSelected}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-yellow-50 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-950/50 transition-colors"
        >
          <Star className="w-3.5 h-3.5" />
          Star
        </button>
        <button
          onClick={handleTrashSelected}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/50 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Trash
        </button>
        <button
          onClick={selectAll}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <CheckSquare className="w-3.5 h-3.5" />
          Select all
        </button>
        <button
          onClick={clearSelection}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
          Clear
        </button>
      </div>
    )
  }

  if (activeSection !== 'my-drive') return null

  return (
    <div className="flex items-center gap-2 py-2">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => {
          const f = Array.from(e.target.files || [])
          if (f.length) { upload(f); e.target.value = '' }
        }}
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors"
      >
        <Upload className="w-3.5 h-3.5" />
        Upload
      </button>
      <button
        onClick={() => setNewFolderModal(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        <FolderPlus className="w-3.5 h-3.5" />
        New folder
      </button>
    </div>
  )
}
