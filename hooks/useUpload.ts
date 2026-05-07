'use client'

import { useCallback } from 'react'
import toast from 'react-hot-toast'

import { useDriveStore } from '@/store/driveStore'
import { uploadFile } from '@/lib/fileOperations'
import { useUserStorage } from '@/hooks/useUserStorage'

export function useUpload() {
  const {
    user,
    currentFolderId,
    addUploadTask,
    updateUploadTask,
    removeUploadTask,
  } = useDriveStore()

  const { used, limit } = useUserStorage(user?.uid)

  const upload = useCallback(
    async (files: File[]) => {
      if (!user) return

      for (const file of files) {
        // STORAGE LIMIT
        if (used + file.size > limit) {
          toast.error(
            `Storage limit exceeded for "${file.name}"`
          )

          continue
        }

        const taskId = `${Date.now()}-${Math.random()}`

        addUploadTask({
          id: taskId,
          name: file.name,
          progress: 0,
          status: 'uploading',
          file,
        })

        try {
          await uploadFile(
            user.uid,
            file,
            currentFolderId,
            (progress) => {
              updateUploadTask(taskId, {
                progress,
              })
            }
          )

          updateUploadTask(taskId, {
            status: 'done',
            progress: 100,
          })

          toast.success(
            `"${file.name}" uploaded successfully`
          )

          setTimeout(() => {
            removeUploadTask(taskId)
          }, 3000)

        } catch (err) {
          console.error(err)

          updateUploadTask(taskId, {
            status: 'error',
          })

          toast.error(
            `Failed to upload "${file.name}"`
          )

          setTimeout(() => {
            removeUploadTask(taskId)
          }, 5000)
        }
      }
    },
    [
      user,
      currentFolderId,
      addUploadTask,
      updateUploadTask,
      removeUploadTask,
      used,
      limit,
    ]
  )

  return { upload }
}