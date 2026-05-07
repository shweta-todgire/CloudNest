import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (!bytes || bytes === 0) return '0 B'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export function getFileIcon(mimeType?: string): string {
  if (!mimeType) return '📄'
  if (mimeType.startsWith('image/')) return '🖼️'
  if (mimeType.startsWith('video/')) return '🎬'
  if (mimeType.startsWith('audio/')) return '🎵'
  if (mimeType.includes('pdf')) return '📕'
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return '📊'
  if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return '📑'
  if (mimeType.includes('document') || mimeType.includes('word')) return '📝'
  if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('tar')) return '🗜️'
  if (mimeType.includes('text')) return '📄'
  if (mimeType.includes('javascript') || mimeType.includes('typescript') || mimeType.includes('json')) return '💻'
  return '📄'
}

export function getFileColor(mimeType?: string): string {
  if (!mimeType) return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
  if (mimeType.startsWith('image/')) return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
  if (mimeType.startsWith('video/')) return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
  if (mimeType.startsWith('audio/')) return 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400'
  if (mimeType.includes('pdf')) return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
  if (mimeType.includes('presentation')) return 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
  if (mimeType.includes('document') || mimeType.includes('word')) return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
  return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
}

export function getMimeCategory(mimeType?: string): string {
  if (!mimeType) return 'other'
  if (mimeType.startsWith('image/')) return 'images'
  if (mimeType.startsWith('video/')) return 'videos'
  if (mimeType.startsWith('audio/')) return 'audio'
  if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('word') || mimeType.includes('text')) return 'documents'
  return 'other'
}

export function isPreviewable(mimeType?: string): boolean {
  if (!mimeType) return false
  return (
    mimeType.startsWith('image/') ||
    mimeType.includes('pdf') ||
    mimeType.startsWith('video/') ||
    mimeType.startsWith('audio/') ||
    mimeType.startsWith('text/')
  )
}
