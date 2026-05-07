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

import { auth, db, googleProvider } from './firebase'

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
   CREATE USER PROFILE
========================================================= */

async function createUserProfile(
  user: User,
  provider = 'email'
) {
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

        storageUsed: data?.storageUsed ?? 0,
        storageLimit:
          data?.storageLimit ?? STORAGE_LIMIT,

        updatedAt: serverTimestamp(),
      },
      { merge: true }
    )
  }
}

/* =========================================================
   SIGN UP
========================================================= */

export async function signUpWithEmail(
  email: string,
  password: string,
  displayName: string
): Promise<UserCredential> {
  const cred =
    await createUserWithEmailAndPassword(
      auth,
      email,
      password
    )

  // update firebase auth profile
  await updateProfile(cred.user, {
    displayName,
  })

  // send verification email
  await sendEmailVerification(cred.user)

  // create firestore user
  await createUserProfile(cred.user, 'email')

  return cred
}

/* =========================================================
   LOGIN
========================================================= */

export async function signInWithEmail(
  email: string,
  password: string
): Promise<UserCredential> {
  const cred =
    await signInWithEmailAndPassword(
      auth,
      email,
      password
    )

  await createUserProfile(cred.user, 'email')

  return cred
}

/* =========================================================
   GOOGLE LOGIN
========================================================= */

export async function signInWithGoogle(): Promise<UserCredential> {
  const res = await signInWithPopup(
    auth,
    googleProvider
  )

  await createUserProfile(res.user, 'google')

  return res
}

/* =========================================================
   RESET PASSWORD
========================================================= */

export const resetPassword = (
  email: string
) => sendPasswordResetEmail(auth, email)

/* =========================================================
   SEND EMAIL VERIFICATION AGAIN
========================================================= */

export async function sendVerificationMail() {
  if (!auth.currentUser) return

  await sendEmailVerification(auth.currentUser)
}

/* =========================================================
   UPDATE DISPLAY NAME
========================================================= */

export async function updateUserName(
  name: string
) {
  if (!auth.currentUser) return

  await updateProfile(auth.currentUser, {
    displayName: name,
  })

  await updateDoc(
    doc(db, 'users', auth.currentUser.uid),
    {
      displayName: name,
      updatedAt: serverTimestamp(),
    }
  )
}

/* =========================================================
   UPDATE EMAIL
========================================================= */

export async function updateUserEmail(
  newEmail: string
) {
  if (!auth.currentUser) return

  await updateEmail(auth.currentUser, newEmail)

  await updateDoc(
    doc(db, 'users', auth.currentUser.uid),
    {
      email: newEmail,
      updatedAt: serverTimestamp(),
    }
  )

  // send verification again
  await sendEmailVerification(auth.currentUser)
}

/* =========================================================
   DELETE ACCOUNT
========================================================= */

export async function deleteUserAccount() {
  if (!auth.currentUser) return

  const uid = auth.currentUser.uid

  // delete firestore user doc
  await deleteDoc(doc(db, 'users', uid))

  // delete auth account
  await deleteUser(auth.currentUser)
}

/* =========================================================
   LOGOUT
========================================================= */

export const signOutUser = () =>
  signOut(auth)