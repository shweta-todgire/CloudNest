'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { UploadPanel } from '@/components/layout/UploadPanel'
import { RenameModal } from '@/components/modals/RenameModal'
import { NewFolderModal } from '@/components/modals/NewFolderModal'
import { PreviewModal } from '@/components/modals/PreviewModal'
import { Loader2, Menu, X } from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, authLoading } = useAuth()
  const router = useRouter()

  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) router.replace('/auth')
  }, [user, authLoading, router])

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-gray-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg">
            <span className="text-2xl">☁️</span>
          </div>
          <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-gray-950">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:static top-0 left-0 z-50 h-full
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Top Bar */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

          <h1 className="font-semibold text-gray-900 dark:text-white">
            CloudNest
          </h1>

          <div className="w-9" />
        </div>

        <Header />

        <main className="flex-1 overflow-y-auto p-6 animate-fade-in">
          {children}
        </main>
      </div>

      <UploadPanel />
      <RenameModal />
      <NewFolderModal />
      <PreviewModal />
    </div>
  )
}