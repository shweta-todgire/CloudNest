export interface DriveFile {
  id: string
  name: string
  type: 'file' | 'folder'
  mimeType?: string
  size?: number
  url?: string
  thumbnailUrl?: string
  parentId: string | null
  ownerId: string
  createdAt: Date
  updatedAt: Date
  isStarred: boolean
  isTrashed: boolean
  trashedAt?: Date
  sharedWith?: string[]
  color?: string
  storagePath?: string
}

export interface User {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
}

export interface UploadTask {
  id: string
  name: string
  progress: number
  status: 'uploading' | 'done' | 'error'
  file: File
}

export type ViewMode = 'grid' | 'list'
export type SortBy = 'name' | 'date' | 'size' | 'type'
export type SortOrder = 'asc' | 'desc'

export interface FileFilter {
  type?: 'all' | 'documents' | 'images' | 'videos' | 'audio'
  sortBy: SortBy
  sortOrder: SortOrder
}
