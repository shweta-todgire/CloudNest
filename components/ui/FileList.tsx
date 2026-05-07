'use client'
import { format } from 'date-fns'
import { Star, Folder, MoreVertical, Trash2, Download, Eye, Pencil } from 'lucide-react'
import { DriveFile } from '@/types'
import { useDriveStore } from '@/store/driveStore'
import { toggleStar, moveToTrash } from '@/lib/fileOperations'
import { cn, getFileIcon, formatBytes } from '@/lib/utils'
import toast from 'react-hot-toast'
import { useState } from 'react'

interface Props {
  files: DriveFile[]
}

export function FileList({ files }: Props) {
  return (
    <div className="mt-4 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden animate-fade-in">
      <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-3 px-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
        <span className="w-8" />
        <span>Name</span>
        <span className="w-24 text-right">Modified</span>
        <span className="w-20 text-right">Size</span>
        <span className="w-8" />
      </div>
      <div className="divide-y divide-gray-50 dark:divide-gray-800">
        {files.map((file) => (
          <FileRow key={file.id} file={file} />
        ))}
      </div>
    </div>
  )
}

function FileRow({ file }: { file: DriveFile }) {
  const { selectedFiles, toggleSelect, setCurrentFolder, openRenameModal, openPreviewModal } = useDriveStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const isSelected = selectedFiles.has(file.id)

  const handleDoubleClick = () => {
    if (file.type === 'folder') setCurrentFolder(file.id, file.name)
    else openPreviewModal(file)
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

  return (
    <div
      onClick={() => toggleSelect(file.id)}
      onDoubleClick={handleDoubleClick}
      className={cn(
        'grid grid-cols-[auto_1fr_auto_auto_auto] gap-3 items-center px-4 py-2.5 cursor-pointer transition-colors group',
        isSelected
          ? 'bg-blue-50 dark:bg-blue-950/30'
          : 'hover:bg-gray-50 dark:hover:bg-gray-800/40',
      )}
    >
      {/* Icon */}
      <div className="w-8 h-8 flex items-center justify-center">
        {file.type === 'folder' ? (
          <Folder className="w-5 h-5 text-blue-400 dark:text-blue-500" fill="currentColor" strokeWidth={1} />
        ) : (
          <span className="text-xl">{getFileIcon(file.mimeType)}</span>
        )}
      </div>

      {/* Name */}
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{file.name}</p>
        {file.mimeType && (
          <p className="text-xs text-gray-400 dark:text-gray-500">{file.mimeType.split('/')[1]?.toUpperCase()}</p>
        )}
      </div>

      {/* Date */}
      <p className="w-24 text-xs text-gray-400 dark:text-gray-500 text-right">
        {format(file.updatedAt, 'MMM d, yyyy')}
      </p>

      {/* Size */}
      <p className="w-20 text-xs text-gray-400 dark:text-gray-500 text-right">
        {file.size ? formatBytes(file.size) : '—'}
      </p>

      {/* Actions */}
      <div className="w-8 flex justify-center relative">
        <button
          onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen) }}
          className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-all"
        >
          <MoreVertical className="w-4 h-4" />
        </button>

        {menuOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 top-8 z-50 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-1.5 min-w-44 animate-fade-in">
              {file.type === 'file' && (
                <RowMenuItem icon={Eye} label="Preview" onClick={(e) => { e.stopPropagation(); openPreviewModal(file); setMenuOpen(false) }} />
              )}
              <RowMenuItem icon={Pencil} label="Rename" onClick={(e) => { e.stopPropagation(); openRenameModal(file); setMenuOpen(false) }} />
              <RowMenuItem icon={Star} label={file.isStarred ? 'Remove star' : 'Add star'} onClick={handleStar} />
              {file.url && (
                <RowMenuItem icon={Download} label="Download" onClick={(e) => {
                  e.stopPropagation()
                  const a = document.createElement('a')
                  a.href = file.url!; a.download = file.name; a.target = '_blank'; a.click()
                  setMenuOpen(false)
                }} />
              )}
              <div className="h-px bg-gray-100 dark:bg-gray-700 my-1" />
              <RowMenuItem icon={Trash2} label="Move to trash" onClick={handleTrash} danger />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function RowMenuItem({ icon: Icon, label, onClick, danger }: {
  icon: React.ElementType; label: string; onClick: (e: React.MouseEvent) => void; danger?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-2.5 px-3.5 py-2 text-sm transition-colors text-left',
        danger ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700',
      )}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  )
}
