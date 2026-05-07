# ☁️ CloudDrive — Google Drive Clone

A full-featured Google Drive clone built with **Next.js 14**, **Tailwind CSS**, and **Firebase**.

---

## ✨ Features

| Feature | Details |
|---|---|
| 🔐 Authentication | Google Sign-In via Firebase Auth |
| 📁 Folder Management | Create, navigate, and nest folders |
| 📤 File Uploads | Drag-and-drop or click to upload multiple files |
| 📊 Real-time Updates | Live sync via Firestore `onSnapshot` |
| 👁️ File Preview | Images, videos, audio, PDF inline previews |
| ⬇️ Download | Download any file directly |
| ⭐ Starred | Star/unstar files for quick access |
| 🗑️ Trash | Soft-delete with restore and permanent delete |
| 🔍 Search | Real-time search across all your files |
| 📋 Grid & List View | Toggle between grid and list layouts |
| 🔃 Sort | Sort by name, date, or size (asc/desc) |
| 🌙 Dark Mode | Full dark mode support |
| 📱 Responsive | Works on mobile, tablet, and desktop |
| 🔒 Security Rules | Firestore + Storage rules for user data isolation |

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone <your-repo>
cd drive-clone
npm install
```

### 2. Set up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. Enable **Authentication** → Sign-in method → **Google**
3. Enable **Firestore Database** (start in test mode, then apply rules)
4. Enable **Storage** (start in test mode, then apply rules)
5. Go to Project Settings → Your apps → Add a **Web app**
6. Copy the config values

### 3. Configure Environment Variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and fill in your Firebase config:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123:web:abc123
```

### 4. Apply Security Rules

In the Firebase Console:
- **Firestore** → Rules → paste content of `firestore.rules`
- **Storage** → Rules → paste content of `storage.rules`

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🗂️ Project Structure

```
drive-clone/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Redirect to /auth or /dashboard
│   ├── globals.css             # Global styles
│   ├── auth/
│   │   └── page.tsx            # Google sign-in page
│   └── dashboard/
│       ├── layout.tsx          # Dashboard shell (sidebar + header)
│       └── page.tsx            # Main drive view
│
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx         # Navigation sidebar
│   │   ├── Header.tsx          # Search bar + view controls
│   │   └── UploadPanel.tsx     # Upload progress panel
│   ├── ui/
│   │   ├── FileCard.tsx        # Grid file card with context menu
│   │   ├── FileGrid.tsx        # Grid layout
│   │   ├── FileList.tsx        # List layout
│   │   ├── Breadcrumbs.tsx     # Folder navigation breadcrumbs
│   │   ├── Toolbar.tsx         # Upload/folder creation toolbar
│   │   ├── EmptyState.tsx      # Empty state screens
│   │   ├── SearchResults.tsx   # Search results view
│   │   └── TrashView.tsx       # Trash management
│   └── modals/
│       ├── RenameModal.tsx     # Rename file/folder
│       ├── NewFolderModal.tsx  # Create new folder
│       └── PreviewModal.tsx    # File preview (image/video/audio/pdf)
│
├── lib/
│   ├── firebase.ts             # Firebase initialization
│   ├── fileOperations.ts       # All Firestore + Storage operations
│   └── utils.ts                # Helper functions
│
├── hooks/
│   ├── useAuth.ts              # Firebase auth listener
│   ├── useFiles.ts             # Real-time file subscription
│   └── useUpload.ts            # File upload handler
│
├── store/
│   └── driveStore.ts           # Zustand global state
│
├── types/
│   └── index.ts                # TypeScript types
│
├── firestore.rules             # Firestore security rules
├── storage.rules               # Firebase Storage security rules
└── .env.local.example          # Environment variable template
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 14** | React framework with App Router |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Utility-first styling |
| **Firebase Auth** | Google authentication |
| **Firestore** | Real-time NoSQL database |
| **Firebase Storage** | File storage |
| **Zustand** | Lightweight global state |
| **react-dropzone** | Drag-and-drop file uploads |
| **react-hot-toast** | Toast notifications |
| **lucide-react** | Icon library |
| **date-fns** | Date formatting |

---

## 📦 Deploy to Vercel

```bash
npm run build
vercel --prod
```

Add all `NEXT_PUBLIC_FIREBASE_*` environment variables in your Vercel project settings.

---

## 🔒 Security Notes

- All Firestore and Storage operations are scoped to the authenticated user's UID
- Security rules enforce server-side data isolation
- No user can read or write another user's files
- Files are stored at `users/{userId}/filename` in Storage

---

## 📸 Screenshots

The app includes:
- Beautiful authentication page with feature highlights
- Clean sidebar with navigation, storage usage, and user profile
- Grid and list views with hover actions
- Drag-and-drop upload with progress tracking
- Inline preview for images, videos, audio, and PDFs
- Full dark mode support
