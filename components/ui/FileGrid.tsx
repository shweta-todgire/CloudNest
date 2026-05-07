'use client'
import { DriveFile } from '@/types'
import { FileCard } from './FileCard'

interface Props {
  files: DriveFile[]
}

export function FileGrid({ files }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 mt-4 animate-fade-in">
      {files.map((file) => (
        <FileCard key={file.id} file={file} />
      ))}
    </div>
  )
}
