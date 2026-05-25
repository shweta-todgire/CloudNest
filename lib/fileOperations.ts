import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  increment,
  writeBatch,
  getDoc,
} from 'firebase/firestore'

import { db } from './firebase'
import { supabase } from './supabase'

import { DriveFile } from '@/types'

const FILES_COLLECTION = 'files'

/* ─────────────────────────────────────────────────────────────
   FORMAT FILE
───────────────────────────────────────────────────────────── */

function formatFile(d: any): DriveFile {
  const data = d.data()

  return {
    id: d.id,
    ...data,

    createdAt:
      (data.createdAt as Timestamp)?.toDate?.() ?? new Date(),

    updatedAt:
      (data.updatedAt as Timestamp)?.toDate?.() ?? new Date(),

    trashedAt:
      (data.trashedAt as Timestamp)?.toDate?.() ?? null,
  } as DriveFile
}

/* ─────────────────────────────────────────────────────────────
   FILE LISTENERS
───────────────────────────────────────────────────────────── */

export function subscribeToFiles(
  userId: string,
  parentId: string | null,
  callback: (files: DriveFile[]) => void,
) {
  let q

  if (parentId === null) {
    q = query(
      collection(db, FILES_COLLECTION),
      where('ownerId', '==', userId),
      where('parentId', '==', null),
      where('isTrashed', '==', false),
    )
  } else {
    q = query(
      collection(db, FILES_COLLECTION),
      where('ownerId', '==', userId),
      where('parentId', '==', parentId),
      where('isTrashed', '==', false),
    )
  }

  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(formatFile))
  })
}

export function subscribeToStarred(
  userId: string,
  callback: (files: DriveFile[]) => void,
) {
  const q = query(
    collection(db, FILES_COLLECTION),
    where('ownerId', '==', userId),
    where('isStarred', '==', true),
    where('isTrashed', '==', false),
  )

  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(formatFile))
  })
}

export function subscribeToTrash(
  userId: string,
  callback: (files: DriveFile[]) => void,
) {
  const q = query(
    collection(db, FILES_COLLECTION),
    where('ownerId', '==', userId),
    where('isTrashed', '==', true),
  )

  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(formatFile))
  })
}

/* ─────────────────────────────────────────────────────────────
   SEARCH
───────────────────────────────────────────────────────────── */

export async function searchFiles(
  userId: string,
  searchQuery: string,
) {
  const q = query(
    collection(db, FILES_COLLECTION),
    where('ownerId', '==', userId),
    where('isTrashed', '==', false),
  )

  const snap = await getDocs(q)

  const all = snap.docs.map(formatFile)

  const lower = searchQuery.toLowerCase()

  return all.filter((f) =>
    f.name.toLowerCase().includes(lower),
  )
}

/* ─────────────────────────────────────────────────────────────
   CREATE FOLDER
───────────────────────────────────────────────────────────── */

export async function createFolder(
  userId: string,
  name: string,
  parentId: string | null,
) {
  return addDoc(collection(db, FILES_COLLECTION), {
    name,
    type: 'folder',

    parentId: parentId ?? null,
    ownerId: userId,

    isStarred: false,
    isTrashed: false,

    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

/* ─────────────────────────────────────────────────────────────
   FILE UPLOAD
───────────────────────────────────────────────────────────── */

export async function uploadFile(
  userId: string,
  file: File,
  parentId: string | null | undefined,
  onProgress: (progress: number) => void,
): Promise<string> {

  const storagePath = `users/${userId}/${Date.now()}_${file.name}`

  onProgress(20)

  const { error } = await supabase.storage
    .from('images')
    .upload(storagePath, file)

  if (error) {
    throw error
  }

  onProgress(70)

  const { data } = supabase.storage
    .from('images')
    .getPublicUrl(storagePath)

  const url = data.publicUrl

  onProgress(100)

  const docRef = await addDoc(
    collection(db, FILES_COLLECTION),
    {
      name: file.name,
      type: 'file',

      mimeType: file.type,
      size: file.size,

      url,
      storagePath,

      parentId: parentId ?? null,
      ownerId: userId,

      isStarred: false,
      isTrashed: false,

      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
  )

  /* UPDATE STORAGE */
  const userRef = doc(db, 'users', userId)

  const userSnap = await getDoc(userRef)

  if (userSnap.exists()) {
    await updateDoc(userRef, {
      storageUsed: increment(file.size),
    })
  }

  return docRef.id
}

/* ─────────────────────────────────────────────────────────────
   FILE ACTIONS
───────────────────────────────────────────────────────────── */

export async function renameItem(
  fileId: string,
  name: string,
) {
  await updateDoc(doc(db, FILES_COLLECTION, fileId), {
    name,
    updatedAt: serverTimestamp(),
  })
}

export async function toggleStar(
  fileId: string,
  isStarred: boolean,
) {
  await updateDoc(doc(db, FILES_COLLECTION, fileId), {
    isStarred: !isStarred,
  })
}

export async function moveToTrash(fileId: string) {
  await updateDoc(doc(db, FILES_COLLECTION, fileId), {
    isTrashed: true,
    trashedAt: serverTimestamp(),
  })
}

export async function restoreFromTrash(fileId: string) {
  await updateDoc(doc(db, FILES_COLLECTION, fileId), {
    isTrashed: false,
    trashedAt: null,
  })
}

/* ─────────────────────────────────────────────────────────────
   DELETE FILE
───────────────────────────────────────────────────────────── */

export async function permanentlyDelete(
  fileId: string,
  userId: string,
  fileSize?: number,
  storagePath?: string
) {
  try {

    // delete from Supabase Storage
    if (storagePath) {
      try {
        await supabase.storage
          .from('images')
          .remove([storagePath])
      } catch (err) {
        console.log('Storage delete failed:', err)
      }
    }

    // delete Firestore document
    const fileRef = doc(db, FILES_COLLECTION, fileId)

    const fileSnap = await getDoc(fileRef)

    if (!fileSnap.exists()) return

    const data = fileSnap.data()

    const sizeToRemove =
      typeof data.size === 'number'
        ? data.size
        : fileSize || 0

    await deleteDoc(fileRef)

    // update user storage
    const userRef = doc(db, 'users', userId)

    const userSnap = await getDoc(userRef)

    if (userSnap.exists()) {

      const current =
        Number(userSnap.data().storageUsed || 0)

      await updateDoc(userRef, {
        storageUsed: Math.max(
          current - sizeToRemove,
          0
        ),
      })
    }

  } catch (err) {
    console.error('permanentlyDelete error:', err)
  }
}

/* ─────────────────────────────────────────────────────────────
   EMPTY TRASH
───────────────────────────────────────────────────────────── */

export async function emptyTrash(userId: string) {

  const q = query(
    collection(db, FILES_COLLECTION),
    where('ownerId', '==', userId),
    where('isTrashed', '==', true),
  )

  const snap = await getDocs(q)

  const batch = writeBatch(db)

  let totalDeletedSize = 0

  for (const d of snap.docs) {

    const data: any = d.data()

    totalDeletedSize += data.size || 0

    // delete from Supabase Storage
    if (data.storagePath) {
      try {
        await supabase.storage
          .from('images')
          .remove([data.storagePath])
      } catch {}
    }

    batch.delete(d.ref)
  }

  await batch.commit()

  const userRef = doc(db, 'users', userId)

  const userSnap = await getDoc(userRef)

  if (userSnap.exists()) {

    const currentStorage =
      userSnap.data().storageUsed || 0

    const newStorage = Math.max(
      currentStorage - totalDeletedSize,
      0
    )

    await updateDoc(userRef, {
      storageUsed: newStorage,
    })
  }
}

/* ─────────────────────────────────────────────────────────────
   MOVE FILE
───────────────────────────────────────────────────────────── */

export async function moveFile(
  fileId: string,
  newParentId: string | null,
) {
  await updateDoc(doc(db, FILES_COLLECTION, fileId), {
    parentId: newParentId ?? null,
    updatedAt: serverTimestamp(),
  })
}

/* ─────────────────────────────────────────────────────────────
   GET FILE
───────────────────────────────────────────────────────────── */

export async function getFile(fileId: string) {

  const snap = await getDoc(
    doc(db, FILES_COLLECTION, fileId),
  )

  if (!snap.exists()) return null

  return formatFile(snap)
}