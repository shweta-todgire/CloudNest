'use client'
import { useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { useDriveStore } from '@/store/driveStore'
import { useFiles } from '@/hooks/useFiles'
import { useUpload } from '@/hooks/useUpload'
import { FileGrid } from '@/components/ui/FileGrid'
import { FileList } from '@/components/ui/FileList'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Toolbar } from '@/components/ui/Toolbar'
import { EmptyState } from '@/components/ui/EmptyState'
import { SearchResults } from '@/components/ui/SearchResults'
import { TrashView } from '@/components/ui/TrashView'
import { cn } from '@/lib/utils'

export default function DashboardPage() {
  useFiles()
  const { upload } = useUpload()
  const { files, viewMode, activeSection, searchQuery, searchResults, isSearching } = useDriveStore()

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop: upload,
    noClick: true,
    noKeyboard: true,
  })

  if (activeSection === 'search') {
    return <SearchResults />
  }

  if (activeSection === 'trash') {
    return <TrashView />
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        'flex-1 flex flex-col min-h-full rounded-xl transition-all duration-200',
        isDragActive && 'drag-over',
      )}
    >
      <input {...getInputProps()} />

      {isDragActive && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-blue-50/80 dark:bg-blue-950/50 backdrop-blur-sm rounded-xl pointer-events-none">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-10 shadow-2xl text-center">
            <div className="text-5xl mb-4">📂</div>
            <p className="text-xl font-semibold text-blue-600 dark:text-blue-400">
              Drop to upload
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Files will be added to current folder
            </p>
          </div>
        </div>
      )}

      <Breadcrumbs />
      <Toolbar onUploadClick={open} />

      {files.length === 0 ? (
        <EmptyState section={activeSection} onUpload={open} />
      ) : viewMode === 'grid' ? (
        <FileGrid files={files} />
      ) : (
        <FileList files={files} />
      )}
    </div>
  )
}
