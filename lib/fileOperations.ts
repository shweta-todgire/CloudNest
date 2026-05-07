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

import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage'

import { db, storage } from './firebase'
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

export function uploadFile(
  userId: string,
  file: File,
  parentId: string | null | undefined,
  onProgress: (progress: number) => void,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const storagePath = `users/${userId}/${Date.now()}_${file.name}`

    const storageRef = ref(storage, storagePath)

    const task = uploadBytesResumable(storageRef, file)

    task.on(
      'state_changed',

      (snap) => {
        const pct = Math.round(
          (snap.bytesTransferred / snap.totalBytes) * 100,
        )

        onProgress(pct)
      },

      reject,

      async () => {
        try {
          const url = await getDownloadURL(task.snapshot.ref)

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

          /* ✅ UPDATE STORAGE */
          const userRef = doc(db, 'users', userId)

          const userSnap = await getDoc(userRef)

          if (userSnap.exists()) {
            await updateDoc(userRef, {
              storageUsed: increment(file.size),
            })
          }

          resolve(docRef.id)
        } catch (err) {
          reject(err)
        }
      },
    )
  })
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
  fileSize: number = 0,
  storagePath?: string,
) {
  try {
    if (storagePath) {
      await deleteObject(ref(storage, storagePath))
    }
  } catch (err) {
    console.error(err)
  }

  const userRef = doc(db, 'users', userId)

  const userSnap = await getDoc(userRef)

  if (userSnap.exists()) {
    const currentStorage =
      userSnap.data().storageUsed || 0

    const newStorage = Math.max(
      currentStorage - fileSize,
      0
    )

    await updateDoc(userRef, {
      storageUsed: newStorage,
    })
  }

  await deleteDoc(doc(db, FILES_COLLECTION, fileId))
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

    if (data.storagePath) {
      try {
        await deleteObject(ref(storage, data.storagePath))
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