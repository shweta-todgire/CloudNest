'use client'

import { signOut } from 'firebase/auth'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

import {
  HardDrive,
  Star,
  Trash2,
  Upload,
  FolderPlus,
  LogOut,
  HelpCircle,
  FileText,
} from 'lucide-react'

import { auth } from '@/lib/firebase'
import { useDriveStore } from '@/store/driveStore'
import { useUpload } from '@/hooks/useUpload'
import { formatBytes } from '@/lib/formatBytes'
import { useUserStorage } from '@/hooks/useUserStorage'
import { cn } from '@/lib/utils'

import toast from 'react-hot-toast'
import { useRef } from 'react'

export function Sidebar() {
  const router = useRouter()

  const pathname = usePathname()

  const {
    user,
    activeSection,
    setActiveSection,
    setCurrentFolder,
    setNewFolderModal,
  } = useDriveStore()

  const { upload } = useUpload()

  const fileInputRef =
    useRef<HTMLInputElement>(null)

  /* STORAGE */
  const {
    used = 0,
    limit = 15 * 1024 * 1024 * 1024,
  } = useUserStorage(user?.uid) || {}

  const safeUsed =
    typeof used === 'number'
      ? used
      : 0

  const safeLimit =
    typeof limit === 'number'
      ? limit
      : 15 * 1024 * 1024 * 1024

  const percent =
    safeLimit > 0
      ? Math.min(
          (safeUsed / safeLimit) * 100,
          100
        )
      : 0

  const usedFormatted =
    formatBytes(safeUsed)

  const limitFormatted =
    formatBytes(safeLimit)

  /* SIGN OUT */
  const handleSignOut = async () => {
    await signOut(auth)

    toast.success(
      'Signed out successfully'
    )

    router.replace('/auth/login')
  }

  /* DRIVE NAV */
  const navItems = [
    {
      id: 'my-drive',
      label: 'My Drive',
      icon: HardDrive,
    },
    {
      id: 'starred',
      label: 'Starred',
      icon: Star,
    },
    {
      id: 'trash',
      label: 'Trash',
      icon: Trash2,
    },
  ] as const

  const handleNavClick = (
    id: typeof navItems[number]['id']
  ) => {
    setActiveSection(id)

    if (id === 'my-drive') {
      setCurrentFolder(null, 'My Drive')
    }

    router.push('/dashboard')
  }

  /* EXTRA PAGES */
  const moreLinks = [
    {
      href: '/help',
      label: 'Help Center',
      icon: HelpCircle,
    },
    {
      href: '/privacy-policy',
      label: 'Privacy Policy',
      icon: FileText,
    },
    {
      href: '/terms',
      label: 'Terms & Conditions',
      icon: FileText,
    },
  ]

  return (
    <aside className="w-64 shrink-0 h-screen overflow-y-auto border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 flex flex-col">

      {/* LOGO */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-100 dark:border-gray-800">

        <Image
          src="/logo.png"
          alt="CloudNest"
          width={40}
          height={40}
          priority
        />

        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            CloudNest
          </h1>

          <p className="text-xs text-gray-400">
            Cloud Storage
          </p>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="p-4 space-y-2">

        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => {
            const files = Array.from(
              e.target.files || []
            )

            if (files.length) {
              upload(files)

              e.target.value = ''
            }
          }}
        />

        <button
          onClick={() =>
            fileInputRef.current?.click()
          }
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white py-3 text-sm font-semibold transition-colors"
        >
          <Upload className="w-4 h-4" />

          Upload Files
        </button>

        <button
          onClick={() =>
            setNewFolderModal(true)
          }
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors"
        >
          <FolderPlus className="w-4 h-4" />

          New Folder
        </button>
      </div>

      {/* DRIVE NAV */}
      <div className="px-3">

        <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Drive
        </p>

        <div className="space-y-1">
          {navItems.map(
            ({
              id,
              label,
              icon: Icon,
            }) => (
              <button
                key={id}
                onClick={() =>
                  handleNavClick(id)
                }
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all',
                  activeSection === id
                    ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />

                {label}
              </button>
            )
          )}
        </div>
      </div>

      {/* MORE */}
      <div className="px-3 mt-6">

        <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
          More
        </p>

        <div className="space-y-1">
          {moreLinks.map(
            ({
              href,
              label,
              icon: Icon,
            }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all',
                  pathname === href
                    ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />

                {label}
              </Link>
            )
          )}
        </div>
      </div>

      {/* STORAGE */}
      <div className="mt-auto p-4 border-t border-gray-100 dark:border-gray-800">

        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Storage
          </span>

          <span className="text-xs text-gray-500 dark:text-gray-400">
            {usedFormatted} / {limitFormatted}
          </span>
        </div>

        <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">

          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-500"
            style={{
              width: `${
                isNaN(percent)
                  ? 0
                  : percent
              }%`,
            }}
          />
        </div>

        <p className="mt-2 text-xs text-gray-400">
          {isNaN(percent)
            ? '0.0'
            : percent.toFixed(1)}
          % used
        </p>
      </div>

      {/* USER */}
      <div className="p-3 border-t border-gray-100 dark:border-gray-800">

        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group">

          {user?.photoURL ? (
            <Image
              src={user.photoURL}
              alt={
                user.displayName || 'User'
              }
              width={40}
              height={40}
              className="rounded-full"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
              {user?.displayName?.[0] ??
                user?.email?.[0] ??
                'U'}
            </div>
          )}

          <div className="flex-1 min-w-0">

            <p className="text-sm font-semibold truncate text-gray-900 dark:text-white">
              {user?.displayName ||
                'User'}
            </p>

            <p className="text-xs truncate text-gray-400">
              {user?.email}
            </p>
          </div>

          <button
            onClick={handleSignOut}
            title="Sign Out"
            className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
          >
            <LogOut className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>
    </aside>
  )
}