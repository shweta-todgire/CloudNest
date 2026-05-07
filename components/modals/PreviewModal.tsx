'use client'
import { X, Download, Star, ExternalLink } from 'lucide-react'
import { useDriveStore } from '@/store/driveStore'
import { toggleStar } from '@/lib/fileOperations'
import { formatBytes, getFileIcon } from '@/lib/utils'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

export function PreviewModal() {
  const { previewModal, closePreviewModal } = useDriveStore()
  const { open, file } = previewModal

  if (!open || !file) return null

  const isImage = file.mimeType?.startsWith('image/')
  const isVideo = file.mimeType?.startsWith('video/')
  const isAudio = file.mimeType?.startsWith('audio/')
  const isPdf = file.mimeType?.includes('pdf')

  const handleStar = async () => {
    await toggleStar(file.id, file.isStarred)
    toast.success(file.isStarred ? 'Removed from starred' : 'Added to starred')
  }

  const handleDownload = () => {
    if (file.url) {
      const a = document.createElement('a')
      a.href = file.url; a.download = file.name; a.target = '_blank'; a.click()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-slide-up overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <span className="text-2xl">{getFileIcon(file.mimeType)}</span>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 dark:text-white truncate">{file.name}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {file.size && formatBytes(file.size)} · Modified {format(file.updatedAt, 'MMM d, yyyy')}
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleStar}
              className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${file.isStarred ? 'text-yellow-500' : 'text-gray-400'}`}
            >
              <Star className="w-4 h-4" fill={file.isStarred ? 'currentColor' : 'none'} />
            </button>
            {file.url && (
              <>
                <button onClick={handleDownload} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors">
                  <Download className="w-4 h-4" />
                </button>
                <a href={file.url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </a>
              </>
            )}
            <button onClick={closePreviewModal} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Preview content */}
        <div className="flex-1 overflow-auto flex items-center justify-center bg-gray-50 dark:bg-gray-950 min-h-0">
          {isImage && file.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={file.url}
              alt={file.name}
              className="max-w-full max-h-full object-contain p-4"
            />
          ) : isVideo && file.url ? (
            <video src={file.url} controls className="max-w-full max-h-full rounded-lg">
              Your browser does not support video playback.
            </video>
          ) : isAudio && file.url ? (
            <div className="flex flex-col items-center gap-6 p-12">
              <span className="text-8xl">🎵</span>
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300">{file.name}</p>
              <audio src={file.url} controls className="w-full max-w-sm" />
            </div>
          ) : isPdf && file.url ? (
            <iframe src={file.url} className="w-full h-full min-h-96" title={file.name} />
          ) : (
            <div className="flex flex-col items-center gap-4 p-12">
              <span className="text-8xl">{getFileIcon(file.mimeType)}</span>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">{file.name}</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">Preview not available for this file type</p>
              {file.url && (
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download file
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
