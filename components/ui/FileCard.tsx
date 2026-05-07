'use client'
import { useState } from 'react'
import { format } from 'date-fns'
import { Star, Trash2, Download, Eye, Pencil, MoreVertical, Folder, Move } from 'lucide-react'
import { DriveFile } from '@/types'
import { useDriveStore } from '@/store/driveStore'
import { toggleStar, moveToTrash } from '@/lib/fileOperations'
import { cn, getFileIcon, getFileColor, formatBytes } from '@/lib/utils'
import toast from 'react-hot-toast'

interface Props {
  file: DriveFile
  compact?: boolean
}

export function FileCard({ file, compact }: Props) {
  const {
    selectedFiles, toggleSelect, setCurrentFolder,
    openRenameModal, openPreviewModal,
  } = useDriveStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const isSelected = selectedFiles.has(file.id)

  const handleDoubleClick = () => {
    if (file.type === 'folder') {
      setCurrentFolder(file.id, file.name)
    } else {
      openPreviewModal(file)
    }
  }

  const handleStar = async (e: React.MouseEvent) => {
    e.stopPropagation()
    await toggleStar(file.id, file.isStarred)
    toast.success(file.isStarred ? 'Removed from starred' : 'Added to starred')
  }

  const handleTrash = async (e: React.MouseEvent) => {
    e.stopPropagation()
    await moveToTrash(file.id)
    toast.success(`"${file.name}" moved to trash`)
    setMenuOpen(false)
  }

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (file.url) {
      const a = document.createElement('a')
      a.href = file.url
      a.download = file.name
      a.target = '_blank'
      a.click()
    }
    setMenuOpen(false)
  }

  return (
    <div
      onDoubleClick={handleDoubleClick}
      onClick={() => toggleSelect(file.id)}
      className={cn(
        'file-card relative group rounded-xl border border-transparent p-3 flex flex-col gap-2',
        isSelected
          ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-700'
          : 'hover:bg-gray-50 dark:hover:bg-gray-800/60 hover:border-gray-200 dark:hover:border-gray-700',
      )}
    >
      {/* Thumbnail */}
      <div
        className={cn(
          'relative rounded-lg overflow-hidden flex items-center justify-center aspect-square',
          file.type === 'folder'
            ? 'bg-blue-50 dark:bg-blue-950/30'
            : getFileColor(file.mimeType),
        )}
      >
        {file.type === 'folder' ? (
          <Folder className="w-12 h-12 text-blue-400 dark:text-blue-500" fill="currentColor" strokeWidth={1} />
        ) : file.mimeType?.startsWith('image/') && file.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-4xl">{getFileIcon(file.mimeType)}</span>
        )}

        {/* Hover overlay with actions */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 dark:group-hover:bg-black/30 transition-all flex items-start justify-between p-1.5 opacity-0 group-hover:opacity-100">
          <button
            onClick={handleStar}
            className={cn(
              'p-1.5 rounded-full bg-white/90 dark:bg-gray-900/90 shadow transition-colors',
              file.isStarred ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500',
            )}
          >
            <Star className="w-3.5 h-3.5" fill={file.isStarred ? 'currentColor' : 'none'} />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen) }}
            className="p-1.5 rounded-full bg-white/90 dark:bg-gray-900/90 shadow text-gray-500 hover:text-gray-800 dark:hover:text-white"
          >
            <MoreVertical className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Name */}
      <div>
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate leading-tight">
          {file.name}
        </p>
        {!compact && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            {file.type === 'folder'
              ? 'Folder'
              : file.size
              ? formatBytes(file.size)
              : format(file.updatedAt, 'MMM d, yyyy')}
          </p>
        )}
      </div>

      {/* Context menu */}
      {menuOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
          <div className="absolute right-2 top-16 z-50 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-1.5 min-w-44 animate-fade-in">
            {file.type === 'file' && (
              <MenuItem icon={Eye} label="Preview" onClick={(e) => { e.stopPropagation(); openPreviewModal(file); setMenuOpen(false) }} />
            )}
            <MenuItem icon={Pencil} label="Rename" onClick={(e) => { e.stopPropagation(); openRenameModal(file); setMenuOpen(false) }} />
            <MenuItem
              icon={Star}
              label={file.isStarred ? 'Remove star' : 'Add star'}
              onClick={handleStar}
            />
            {file.url && (
              <MenuItem icon={Download} label="Download" onClick={handleDownload} />
            )}
            <div className="h-px bg-gray-100 dark:bg-gray-700 my-1" />
            <MenuItem icon={Trash2} label="Move to trash" onClick={handleTrash} danger />
          </div>
        </>
      )}
    </div>
  )
}

function MenuItem({
  icon: Icon, label, onClick, danger,
}: {
  icon: React.ElementType
  label: string
  onClick: (e: React.MouseEvent) => void
  danger?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-2.5 px-3.5 py-2 text-sm transition-colors text-left',
        danger
          ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700',
      )}
    >
      <Icon className="w-4 h-4 shrink-0" />
      {label}
    </button>
  )
}
