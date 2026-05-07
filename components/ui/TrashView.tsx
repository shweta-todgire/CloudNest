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

  const handleRestore = async (
    id: string,
    name: string
  ) => {
    await restoreFromTrash(id)
    toast.success(`"${name}" restored`)
  }

  const handleDelete = async (
    id: string,
    name: string,
    storagePath?: string
  ) => {
    if (
      !confirm(
        `Permanently delete "${name}"? This cannot be undone.`
      )
    )
      return

    await permanentlyDelete(id, storagePath)

    toast.success(`"${name}" permanently deleted`)
  }

  const handleEmptyTrash = async () => {
    if (!user) return

    if (
      !confirm(
        'Permanently delete all items in trash? This cannot be undone.'
      )
    )
      return

    await emptyTrash(user.uid)

    toast.success('Trash emptied')
  }

  if (files.length === 0) {
    return <EmptyState section="trash" />
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {files.length} item
          {files.length !== 1 ? 's' : ''} in trash
        </p>

        <button
          onClick={handleEmptyTrash}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/50 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Empty trash
        </button>
      </div>

      {/* Warning */}
      <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3 flex items-center gap-2 mb-4 text-sm text-amber-700 dark:text-amber-400">
        <AlertTriangle className="w-4 h-4 shrink-0" />
        Items in trash will be permanently deleted after 30 days
      </div>

      {/* Files */}
      <div className="rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="divide-y divide-gray-50 dark:divide-gray-800">

          {files.map((file) => {
            const deletedDate =
              file.trashedAt &&
              !isNaN(
                new Date(
                  file.trashedAt?.toDate
                    ? file.trashedAt.toDate()
                    : file.trashedAt
                ).getTime()
              )
                ? format(
                    new Date(
                      file.trashedAt?.toDate
                        ? file.trashedAt.toDate()
                        : file.trashedAt
                    ),
                    'MMM d, yyyy'
                  )
                : 'recently'

            return (
              <div
                key={file.id}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
              >
                {/* Icon / Preview */}
                <div className="w-10 h-10 flex items-center justify-center shrink-0">

                  {file.type === 'folder' ? (
                    <Folder
                      className="w-6 h-6 text-blue-400"
                      fill="currentColor"
                      strokeWidth={1}
                    />
                  ) : file.mimeType?.startsWith('image/') &&
                    file.url ? (
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-10 h-10 object-cover rounded-md border border-gray-200 dark:border-gray-700"
                    />
                  ) : (
                    <span className="text-xl">
                      {getFileIcon(file.mimeType)}
                    </span>
                  )}

                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate line-through opacity-60">
                    {file.name}
                  </p>

                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    Deleted {deletedDate}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() =>
                      handleRestore(file.id, file.name)
                    }
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-950/50 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Restore
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(
                        file.id,
                        file.name,
                        file.storagePath
                      )
                    }
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/50 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete forever
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