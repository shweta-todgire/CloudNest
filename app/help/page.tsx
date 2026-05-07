'use client'

import {
  resetPassword,
  deleteUserAccount,
} from '@/lib/auth'

import { auth } from '@/lib/firebase'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

import {
  Upload,
  FolderPlus,
  RotateCcw,
  Shield,
  Lock,
  Trash2,
  AlertTriangle,
  HelpCircle,
  HardDrive,
} from 'lucide-react'

export default function HelpPage() {
  const router = useRouter()

  const user = auth.currentUser

  const handleResetPassword = async () => {
    try {
      if (!user?.email) return

      await resetPassword(user.email)

      toast.success('Password reset email sent')
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  const handleDelete = async () => {
    const confirmDelete = confirm(
      'Are you sure you want to permanently delete your account?'
    )

    if (!confirmDelete) return

    try {
      await deleteUserAccount()

      toast.success('Account deleted successfully')

      router.replace('/auth')
    } catch (err: any) {
      toast.error(
        err.message ||
          'Please login again before deleting your account.'
      )
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-4">

            <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-950/40 flex items-center justify-center">
              <HelpCircle className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            </div>

            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Help & Security Center
              </h1>

              <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                Learn how to use CloudNest and manage your account securely.
              </p>
            </div>

          </div>
        </div>

        <div className="space-y-6">
          {/* Storage */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-7">

            <div className="flex items-start gap-4">

              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950/40 flex items-center justify-center shrink-0">
                <HardDrive className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Storage Usage
                </h2>

                <ol className="mt-4 list-decimal pl-5 space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Your storage usage is shown in the sidebar.</li>
                  <li>Free users receive 15 GB cloud storage.</li>
                  <li>Delete unnecessary files to free storage space.</li>
                  <li>Files in trash may still use storage until permanently deleted.</li>
                </ol>
              </div>

            </div>
          </div>

          {/* Reset Password */}
          <div className="rounded-2xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/20 p-7">

            <div className="flex items-start gap-4">

              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/40 flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>

              <div className="flex-1">

                <h2 className="text-2xl font-semibold text-blue-700 dark:text-blue-400">
                  Reset Password
                </h2>

                <p className="mt-3 text-blue-900 dark:text-blue-200 leading-relaxed">
                  Send a password reset link to your registered email address.
                  You can create a new password securely from the email link.
                </p>

                <button
                  onClick={handleResetPassword}
                  className="mt-5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
                >
                  Send Reset Link
                </button>

              </div>

            </div>
          </div>

          {/* Delete Account */}
          <div className="rounded-2xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20 p-7">

            <div className="flex items-start gap-4">

              <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-950/40 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>

              <div className="flex-1">

                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-semibold text-red-700 dark:text-red-400">
                    Delete Account
                  </h2>

                  <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>

                <p className="mt-3 text-red-800 dark:text-red-300 leading-relaxed">
                  Deleting your account is permanent and cannot be undone.
                  All files, folders, and account data will be removed permanently.
                </p>

                <ul className="mt-5 space-y-2 text-sm text-red-700 dark:text-red-300">
                  <li>• All uploaded files will be deleted</li>
                  <li>• Your storage data will be removed</li>
                  <li>• This action is irreversible</li>
                </ul>

                <button
                  onClick={handleDelete}
                  className="mt-6 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
                >
                  Permanently Delete Account
                </button>

              </div>

            </div>
          </div>

          {/* Common Problems */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-7">

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Common Problems & Solutions
            </h2>

            <div className="space-y-5">

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  File upload failed
                </h3>

                <p className="mt-1 text-gray-700 dark:text-gray-300">
                  Check your internet connection and try uploading again.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Image preview not showing
                </h3>

                <p className="mt-1 text-gray-700 dark:text-gray-300">
                  Make sure the uploaded image format is PNG, JPG, JPEG, or WEBP.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Forgot password
                </h3>

                <p className="mt-1 text-gray-700 dark:text-gray-300">
                  Use the password reset section above to receive a reset link.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Deleted files missing
                </h3>

                <p className="mt-1 text-gray-700 dark:text-gray-300">
                  Permanently deleted files cannot be recovered later.
                </p>
              </div>

            </div>
          </div>

          {/* Contact */}
          <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">

            <h2 className="text-3xl font-bold mb-3">
              Need More Help?
            </h2>

            <p className="text-blue-100 mb-6">
              If your issue is not listed above, contact our support team.
            </p>

            <div className="inline-block rounded-xl bg-white/10 border border-white/20 p-5">
              <p className="text-sm text-blue-100 mb-1">
                Support Email
              </p>

              <a
                href="mailto:support@cloudnest.com"
                className="text-lg font-semibold hover:underline"
              >
                support@cloudnest.com
              </a>
            </div>

          </div>

        </div>
      </div>
    </div>
  )
}