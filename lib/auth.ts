'use client'

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  updateEmail,
  deleteUser,
  GoogleAuthProvider,
  User,
  UserCredential,
} from 'firebase/auth'

import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore'

import { auth, db } from './firebase'

/* =========================================================
   GOOGLE PROVIDER
========================================================= */

const googleProvider = new GoogleAuthProvider()

googleProvider.setCustomParameters({
  prompt: 'select_account',
})

/* =========================================================
   STORAGE LIMIT
========================================================= */

const STORAGE_LIMIT = 15 * 1024 * 1024 * 1024 // 15GB

/* =========================================================
   USER PROFILE TYPE
========================================================= */

export interface UserProfile {
  uid: string
  email: string
  displayName: string
  photoURL?: string
  createdAt: unknown
  updatedAt?: unknown
  provider: string
  storageUsed: number
  storageLimit: number
}

/* =========================================================
   CREATE / UPDATE USER PROFILE
========================================================= */

async function createUserProfile(
  user: User,
  provider = 'email'
) {
  try {
    const userRef = doc(db, 'users', user.uid)

    const snapshot = await getDoc(userRef)

    if (!snapshot.exists()) {
      await setDoc(userRef, {
        uid: user.uid,

        email: user.email || '',

        displayName:
          user.displayName ||
          user.email?.split('@')[0] ||
          'User',

        photoURL: user.photoURL || '',

        provider,

        storageUsed: 0,

        storageLimit: STORAGE_LIMIT,

        createdAt: serverTimestamp(),

        updatedAt: serverTimestamp(),
      })
    } else {
      const data = snapshot.data()

      await setDoc(
        userRef,
        {
          email: user.email || '',

          displayName:
            user.displayName ||
            data?.displayName ||
            'User',

          photoURL: user.photoURL || '',

          provider,

          storageUsed:
            data?.storageUsed ?? 0,

          storageLimit:
            data?.storageLimit ??
            STORAGE_LIMIT,

          updatedAt: serverTimestamp(),
        },
        { merge: true }
      )
    }
  } catch (error) {
    console.error(
      'Create User Profile Error:',
      error
    )
    throw error
  }
}

/* =========================================================
   SIGN UP WITH EMAIL
========================================================= */

export async function signUpWithEmail(
  email: string,
  password: string,
  displayName: string
): Promise<UserCredential> {
  try {
    const cred =
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )

    // update auth profile
    await updateProfile(cred.user, {
      displayName,
    })

    // send verification email
    await sendEmailVerification(
      cred.user
    )

    // create firestore profile
    await createUserProfile(
      cred.user,
      'email'
    )

    return cred
  } catch (error) {
    console.error(
      'Signup Error:',
      error
    )
    throw error
  }
}

/* =========================================================
   SIGN IN WITH EMAIL
========================================================= */

export async function signInWithEmail(
  email: string,
  password: string
): Promise<UserCredential> {
  try {
    const cred =
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      )

    await createUserProfile(
      cred.user,
      'email'
    )

    return cred
  } catch (error) {
    console.error(
      'Email Login Error:',
      error
    )
    throw error
  }
}

/* =========================================================
   GOOGLE LOGIN
========================================================= */

export async function signInWithGoogle(): Promise<UserCredential> {
  try {
    const result =
      await signInWithPopup(
        auth,
        googleProvider
      )

    await createUserProfile(
      result.user,
      'google'
    )

    return result
  } catch (error) {
    console.error(
      'Google Login Error:',
      error
    )
    throw error
  }
}

/* =========================================================
   RESET PASSWORD
========================================================= */

export async function resetPassword(
  email: string
) {
  try {
    await sendPasswordResetEmail(
      auth,
      email
    )
  } catch (error) {
    console.error(
      'Reset Password Error:',
      error
    )
    throw error
  }
}

/* =========================================================
   SEND EMAIL VERIFICATION AGAIN
========================================================= */

export async function sendVerificationMail() {
  try {
    if (!auth.currentUser) {
      throw new Error(
        'No authenticated user'
      )
    }

    await sendEmailVerification(
      auth.currentUser
    )
  } catch (error) {
    console.error(
      'Verification Email Error:',
      error
    )
    throw error
  }
}

/* =========================================================
   UPDATE DISPLAY NAME
========================================================= */

export async function updateUserName(
  name: string
) {
  try {
    if (!auth.currentUser) {
      throw new Error(
        'No authenticated user'
      )
    }

    await updateProfile(
      auth.currentUser,
      {
        displayName: name,
      }
    )

    await updateDoc(
      doc(
        db,
        'users',
        auth.currentUser.uid
      ),
      {
        displayName: name,

        updatedAt:
          serverTimestamp(),
      }
    )
  } catch (error) {
    console.error(
      'Update Username Error:',
      error
    )
    throw error
  }
}

/* =========================================================
   UPDATE EMAIL
========================================================= */

export async function updateUserEmail(
  newEmail: string
) {
  try {
    if (!auth.currentUser) {
      throw new Error(
        'No authenticated user'
      )
    }

    await updateEmail(
      auth.currentUser,
      newEmail
    )

    await updateDoc(
      doc(
        db,
        'users',
        auth.currentUser.uid
      ),
      {
        email: newEmail,

        updatedAt:
          serverTimestamp(),
      }
    )

    // resend verification email
    await sendEmailVerification(
      auth.currentUser
    )
  } catch (error) {
    console.error(
      'Update Email Error:',
      error
    )
    throw error
  }
}

/* =========================================================
   DELETE ACCOUNT
========================================================= */

export async function deleteUserAccount() {
  try {
    if (!auth.currentUser) {
      throw new Error(
        'No authenticated user'
      )
    }

    const uid =
      auth.currentUser.uid

    // delete firestore user
    await deleteDoc(
      doc(db, 'users', uid)
    )

    // delete auth user
    await deleteUser(
      auth.currentUser
    )
  } catch (error) {
    console.error(
      'Delete Account Error:',
      error
    )
    throw error
  }
}

/* =========================================================
   LOGOUT
========================================================= */

export async function signOutUser() {
  try {
    await signOut(auth)
  } catch (error) {
    console.error(
      'Logout Error:',
      error
    )
    throw error
  }
}