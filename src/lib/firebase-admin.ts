import { initializeApp, getApps, cert, ServiceAccount } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'
import { getStorage } from 'firebase-admin/storage'
import { env } from './env'

// Initialize Firebase Admin only if credentials are available
let adminAuth: any = null
let adminDb: any = null
let adminStorage: any = null

if (env.FIREBASE_CLIENT_EMAIL && env.FIREBASE_PRIVATE_KEY) {
  const serviceAccount: ServiceAccount = {
    projectId: env.FIREBASE_PROJECT_ID,
    clientEmail: env.FIREBASE_CLIENT_EMAIL,
    privateKey: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }

  // Initialize Firebase Admin
  if (getApps().length === 0) {
    initializeApp({
      credential: cert(serviceAccount),
      projectId: env.FIREBASE_PROJECT_ID,
      storageBucket: `${env.FIREBASE_PROJECT_ID}.appspot.com`,
    })
  }

  // Export Firebase Admin services
  adminAuth = getAuth()
  adminDb = getFirestore()
  adminStorage = getStorage()
} else {
  console.warn('Firebase Admin SDK credentials not provided. Server-side Firebase operations will not be available.')
}

export { adminAuth, adminDb, adminStorage }
export default { adminAuth, adminDb, adminStorage }