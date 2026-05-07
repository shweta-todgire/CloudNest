'use client'

import { format } from 'date-fns'
import {
  Trash2,
  RotateCcw,
  AlertTriangle,
  Folder,
} from 'lucide-react'

import { useDriveStore } from '@/store/driveStore'
import {
  restoreFromTrash,
  permanentlyDelete,
  emptyTrash,
} from '@/lib/fileOperations'

import { getFileIcon } from '@/lib/utils'
import toast from 'react-hot-toast'
import { EmptyState } from './EmptyState'

export function TrashView() {
  const { files, user } = useDriveStore()

  // ---------------- RESTORE ----------------
  const handleRestore = async (id: string, name: string) => {
    try {
      await restoreFromTrash(id)
      toast.success(`"${name}" restored`)
    } catch {
      toast.error('Failed to restore file')
    }
  }

  // ---------------- DELETE ----------------
  
  const handleDelete = async (
    id: string,
    name: string,
    fileSize: number,
    storagePath?: string
  ) => {
    if (!user) return

    await permanentlyDelete(
      id,
      user.uid,
      fileSize,
      storagePath
    )

    toast.success(`"${name}" permanently deleted`)
  }

  // ---------------- EMPTY TRASH ----------------
  const handleEmptyTrash = async () => {
    if (!user) return

    if (!confirm('Delete ALL trash items permanently?')) return

    try {
      await emptyTrash(user.uid)
      toast.success('Trash emptied')
    } catch {
      toast.error('Failed to empty trash')
    }
  }

  // ---------------- DATE FIX (IMPORTANT) ----------------
  const getDate = (ts: any) => {
    if (!ts) return null

    // Firestore Timestamp
    if (typeof ts === 'object' && 'toDate' in ts) {
      return ts.toDate()
    }

    // Already JS Date
    if (ts instanceof Date) return ts

    // string/number fallback
    const d = new Date(ts)
    return isNaN(d.getTime()) ? null : d
  }

  if (!files?.length) {
    return <EmptyState section="trash" />
  }

  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {files.length} item{files.length !== 1 ? 's' : ''} in trash
        </p>

        <button
          onClick={handleEmptyTrash}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Empty trash
        </button>
      </div>

      {/* WARNING */}
      <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3 flex items-center gap-2 mb-4 text-sm text-amber-700 dark:text-amber-400">
        <AlertTriangle className="w-4 h-4" />
        Items will be permanently deleted after 30 days
      </div>

      {/* FILE LIST */}
      <div className="rounded-xl border border-gray-100 dark:border-gray-800">
        <div className="divide-y divide-gray-100 dark:divide-gray-800">

          {files.map((file) => {
            const dateObj = getDate(file.trashedAt)

            const deletedDate = dateObj
              ? format(dateObj, 'MMM d, yyyy')
              : 'recently'

            return (
              <div
                key={file.id}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/40"
              >
                {/* ICON */}
                <div className="w-10 h-10 flex items-center justify-center">
                  {file.type === 'folder' ? (
                    <Folder className="w-6 h-6 text-blue-400" />
                  ) : file.mimeType?.startsWith('image/') && file.url ? (
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-10 h-10 object-cover rounded-md"
                    />
                  ) : (
                    <span className="text-xl">
                      {getFileIcon(file.mimeType)}
                    </span>
                  )}
                </div>

                {/* INFO */}
                <div className="flex-1 min-w-0">
                  <p className="truncate line-through text-sm text-gray-900 dark:text-gray-100">
                    {file.name}
                  </p>

                  <p className="text-xs text-gray-400">
                    Deleted {deletedDate}
                  </p>
                </div>

                {/* ACTIONS */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleRestore(file.id, file.name)}
                    className="text-green-600 text-xs px-2 py-1 rounded bg-green-50"
                  >
                    Restore
                  </button>

                  <button
                   onClick={() =>
                    handleDelete(
                      file.id,
                      file.name,
                      file.size ?? 0,
                      file.storagePath
                    )
                  }
                    className="text-red-600 text-xs px-2 py-1 rounded bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}