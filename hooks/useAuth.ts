'use client'
import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useDriveStore } from '@/store/driveStore'

export function useAuth() {
  const { user, authLoading, setUser, setAuthLoading } = useDriveStore()

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        })
      } else {
        setUser(null)
      }
      setAuthLoading(false)
    })
    return unsub
  }, [setUser, setAuthLoading])

  return { user, authLoading }
}
