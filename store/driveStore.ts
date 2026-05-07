import { create } from 'zustand'
import { User, DriveFile, ViewMode, SortBy, SortOrder, UploadTask, FileFilter } from '@/types'

interface DriveStore {
  // Auth
  user: User | null
  authLoading: boolean
  setUser: (user: User | null) => void
  setAuthLoading: (loading: boolean) => void

  // Navigation
  currentFolderId: string | null
  breadcrumbs: { id: string | null; name: string }[]
  setCurrentFolder: (id: string | null, name: string) => void
  navigateToBreadcrumb: (index: number) => void

  // Files
  files: DriveFile[]
  setFiles: (files: DriveFile[]) => void
  selectedFiles: Set<string>
  toggleSelect: (id: string) => void
  selectAll: () => void
  clearSelection: () => void

  // View
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
  filter: FileFilter
  setFilter: (filter: Partial<FileFilter>) => void

  // Search
  searchQuery: string
  searchResults: DriveFile[]
  setSearchQuery: (q: string) => void
  setSearchResults: (results: DriveFile[]) => void
  isSearching: boolean
  setIsSearching: (v: boolean) => void

  // Uploads
  uploadTasks: UploadTask[]
  addUploadTask: (task: UploadTask) => void
  updateUploadTask: (id: string, update: Partial<UploadTask>) => void
  removeUploadTask: (id: string) => void

  // Modals
  renameModal: { open: boolean; file: DriveFile | null }
  openRenameModal: (file: DriveFile) => void
  closeRenameModal: () => void

  previewModal: { open: boolean; file: DriveFile | null }
  openPreviewModal: (file: DriveFile) => void
  closePreviewModal: () => void

  newFolderModal: boolean
  setNewFolderModal: (open: boolean) => void

  // Active section
  activeSection: 'my-drive' | 'starred' | 'trash' | 'search'
  setActiveSection: (section: 'my-drive' | 'starred' | 'trash' | 'search') => void
}

export const useDriveStore = create<DriveStore>((set, get) => ({
  // Auth
  user: null,
  authLoading: true,
  setUser: (user) => set({ user }),
  setAuthLoading: (authLoading) => set({ authLoading }),

  // Navigation
  currentFolderId: null,
  breadcrumbs: [{ id: null, name: 'My Drive' }],
  setCurrentFolder: (id, name) => {
    const crumbs = get().breadcrumbs
    const existing = crumbs.findIndex((c) => c.id === id)
    if (existing !== -1) {
      set({ currentFolderId: id, breadcrumbs: crumbs.slice(0, existing + 1) })
    } else {
      set({ currentFolderId: id, breadcrumbs: [...crumbs, { id, name }] })
    }
  },
  navigateToBreadcrumb: (index) => {
    const crumbs = get().breadcrumbs.slice(0, index + 1)
    const target = crumbs[crumbs.length - 1]
    set({ currentFolderId: target.id, breadcrumbs: crumbs })
  },

  // Files
  files: [],
  setFiles: (files) => set({ files }),
  selectedFiles: new Set(),
  toggleSelect: (id) => {
    const sel = new Set(get().selectedFiles)
    sel.has(id) ? sel.delete(id) : sel.add(id)
    set({ selectedFiles: sel })
  },
  selectAll: () => set({ selectedFiles: new Set(get().files.map((f) => f.id)) }),
  clearSelection: () => set({ selectedFiles: new Set() }),

  // View
  viewMode: 'grid',
  setViewMode: (viewMode) => set({ viewMode }),
  filter: { sortBy: 'name', sortOrder: 'asc' },
  setFilter: (f) => set((s) => ({ filter: { ...s.filter, ...f } })),

  // Search
  searchQuery: '',
  searchResults: [],
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSearchResults: (searchResults) => set({ searchResults }),
  isSearching: false,
  setIsSearching: (isSearching) => set({ isSearching }),

  // Uploads
  uploadTasks: [],
  addUploadTask: (task) => set((s) => ({ uploadTasks: [...s.uploadTasks, task] })),
  updateUploadTask: (id, update) =>
    set((s) => ({
      uploadTasks: s.uploadTasks.map((t) => (t.id === id ? { ...t, ...update } : t)),
    })),
  removeUploadTask: (id) =>
    set((s) => ({ uploadTasks: s.uploadTasks.filter((t) => t.id !== id) })),

  // Modals
  renameModal: { open: false, file: null },
  openRenameModal: (file) => set({ renameModal: { open: true, file } }),
  closeRenameModal: () => set({ renameModal: { open: false, file: null } }),

  previewModal: { open: false, file: null },
  openPreviewModal: (file) => set({ previewModal: { open: true, file } }),
  closePreviewModal: () => set({ previewModal: { open: false, file: null } }),

  newFolderModal: false,
  setNewFolderModal: (open) => set({ newFolderModal: open }),

  // Active section
  activeSection: 'my-drive',
  setActiveSection: (activeSection) => set({ activeSection }),
}))
