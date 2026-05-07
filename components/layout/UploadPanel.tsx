'use client'
import { CheckCircle, XCircle, X, Loader2, Upload } from 'lucide-react'
import { useDriveStore } from '@/store/driveStore'
import { cn, formatBytes } from '@/lib/utils'

export function UploadPanel() {
  const { uploadTasks, removeUploadTask } = useDriveStore()

  if (uploadTasks.length === 0) return null

  const done = uploadTasks.filter((t) => t.status === 'done').length
  const total = uploadTasks.length

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 animate-slide-up overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Upload className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            Uploading {done}/{total}
          </span>
        </div>
        {done === total && (
          <button
            onClick={() => uploadTasks.forEach((t) => removeUploadTask(t.id))}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <X className="w-3.5 h-3.5 text-gray-500" />
          </button>
        )}
      </div>

      <div className="max-h-60 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
        {uploadTasks.map((task) => (
          <div key={task.id} className="flex items-center gap-3 px-4 py-3">
            <div className="shrink-0">
              {task.status === 'done' ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : task.status === 'error' ? (
                <XCircle className="w-5 h-5 text-red-500" />
              ) : (
                <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-800 dark:text-gray-200 truncate font-medium">
                {task.name}
              </p>
              <div className="flex items-center gap-2 mt-1">
                {task.status === 'uploading' && (
                  <>
                    <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-300"
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 shrink-0">{task.progress}%</span>
                  </>
                )}
                {task.status === 'done' && (
                  <span className="text-xs text-green-600 dark:text-green-400">
                    {formatBytes(task.file.size)} — Done
                  </span>
                )}
                {task.status === 'error' && (
                  <span className="text-xs text-red-500">Upload failed</span>
                )}
              </div>
            </div>
            <button
              onClick={() => removeUploadTask(task.id)}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 shrink-0"
            >
              <X className="w-3 h-3 text-gray-400" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
