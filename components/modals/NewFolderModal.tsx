'use client'
import { useEffect, useRef, useState } from 'react'
import { X, FolderPlus } from 'lucide-react'
import { useDriveStore } from '@/store/driveStore'
import { createFolder } from '@/lib/fileOperations'
import toast from 'react-hot-toast'

export function NewFolderModal() {
  const { newFolderModal, setNewFolderModal, user, currentFolderId } = useDriveStore()
  const [name, setName] = useState('Untitled folder')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (newFolderModal) {
      setName('Untitled folder')
      setTimeout(() => inputRef.current?.select(), 50)
    }
  }, [newFolderModal])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !name.trim()) return
    await createFolder(user.uid, name.trim(), currentFolderId)
    toast.success(`Folder "${name.trim()}" created`)
    setNewFolderModal(false)
  }

  if (!newFolderModal) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm mx-4 animate-slide-up">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <FolderPlus className="w-5 h-5 text-blue-500" />
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">New folder</h2>
          </div>
          <button onClick={() => setNewFolderModal(false)} className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <input
            ref={inputRef}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Folder name"
          />
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setNewFolderModal(false)}
              className="px-4 py-2 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
