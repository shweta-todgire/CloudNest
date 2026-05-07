'use client'

import { useEffect } from 'react'
import { useDriveStore } from '@/store/driveStore'
import {
  subscribeToFiles,
  subscribeToStarred,
  subscribeToTrash,
} from '@/lib/fileOperations'

export function useFiles() {
  const {
    user,
    currentFolderId,
    activeSection,
    setFiles,
    filter,
  } = useDriveStore()

  useEffect(() => {
    if (!user) return

    let unsub: (() => void) | undefined

    const handleFiles = (files: any[]) => {
      setFiles(
        sortFiles(files, filter.sortBy, filter.sortOrder)
      )
    }

    if (activeSection === 'starred') {
      unsub = subscribeToStarred(user.uid, handleFiles)

    } else if (activeSection === 'trash') {
      unsub = subscribeToTrash(user.uid, handleFiles)

    } else {
      unsub = subscribeToFiles(
        user.uid,
        currentFolderId,
        handleFiles
      )
    }

    return () => unsub?.()

  }, [
    user,
    currentFolderId,
    activeSection,
    setFiles,
    filter.sortBy,     // ✅ FIXED
    filter.sortOrder,  // ✅ FIXED
  ])
}

/* =========================
   SORT FUNCTION (SAFE)
========================= */
function sortFiles(
  files: any[],
  sortBy: string,
  sortOrder: string
) {
  return [...files].sort((a, b) => {
    // folders first
    if (a.type === 'folder' && b.type !== 'folder') return -1
    if (b.type === 'folder' && a.type !== 'folder') return 1

    let cmp = 0

    switch (sortBy) {
      case 'name':
        cmp = (a.name || '').localeCompare(b.name || '')
        break

      case 'date':
        cmp =
          (b.updatedAt?.getTime?.() ?? 0) -
          (a.updatedAt?.getTime?.() ?? 0)
        break

      case 'size':
        cmp = (a.size ?? 0) - (b.size ?? 0)
        break

      default:
        cmp = 0
    }

    return sortOrder === 'asc' ? cmp : -cmp
  })
}