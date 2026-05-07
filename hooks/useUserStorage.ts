'use client'

import { useEffect, useState } from 'react'

import {
  doc,
  onSnapshot,
} from 'firebase/firestore'

import { db } from '@/lib/firebase'

const DEFAULT_LIMIT =
  15 * 1024 * 1024 * 1024 // 15GB

export function useUserStorage(
  userId?: string
) {
  const [used, setUsed] = useState(0)

  const [limit, setLimit] =
    useState(DEFAULT_LIMIT)

  useEffect(() => {
    if (!userId) {
      setUsed(0)
      setLimit(DEFAULT_LIMIT)
      return
    }

    const unsub = onSnapshot(
      doc(db, 'users', userId),
      (snap) => {
        if (!snap.exists()) {
          setUsed(0)
          setLimit(DEFAULT_LIMIT)
          return
        }

        const data = snap.data()

        setUsed(
          typeof data.storageUsed === 'number'
            ? data.storageUsed
            : 0
        )

        setLimit(
          typeof data.storageLimit === 'number'
            ? data.storageLimit
            : DEFAULT_LIMIT
        )
      },
      () => {
        setUsed(0)
        setLimit(DEFAULT_LIMIT)
      }
    )

    return () => unsub()
  }, [userId])

  return {
    used,
    limit,
  }
}