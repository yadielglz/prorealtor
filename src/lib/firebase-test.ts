import { app, auth, db, storage } from './firebase'
import { connectAuthEmulator } from 'firebase/auth'
import { connectFirestoreEmulator } from 'firebase/firestore'
import { connectStorageEmulator } from 'firebase/storage'

/**
 * Test Firebase configuration and connection
 */
export async function testFirebaseConnection() {
  try {
    console.log('🔥 Testing Firebase Configuration...')
    
    // Test Firebase App initialization
    console.log('✅ Firebase App initialized:', app.name)
    console.log('📋 Project ID:', app.options.projectId)
    console.log('🔐 Auth Domain:', app.options.authDomain)
    console.log('🗄️ Storage Bucket:', app.options.storageBucket)
    
    // Test Auth service
    console.log('🔑 Auth service initialized:', !!auth)
    
    // Test Firestore service
    console.log('📊 Firestore service initialized:', !!db)
    
    // Test Storage service
    console.log('📁 Storage service initialized:', !!storage)
    
    return {
      success: true,
      services: {
        app: !!app,
        auth: !!auth,
        firestore: !!db,
        storage: !!storage
      },
      config: {
        projectId: app.options.projectId,
        authDomain: app.options.authDomain,
        storageBucket: app.options.storageBucket
      }
    }
  } catch (error) {
    console.error('❌ Firebase configuration error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Connect to Firebase emulators for development
 */
export function connectToEmulators() {
  if (process.env.NODE_ENV === 'development') {
    try {
      // Connect to Auth emulator
      connectAuthEmulator(auth, 'http://localhost:9099')
      console.log('🔧 Connected to Auth emulator')
      
      // Connect to Firestore emulator
      connectFirestoreEmulator(db, 'localhost', 8080)
      console.log('🔧 Connected to Firestore emulator')
      
      // Connect to Storage emulator
      connectStorageEmulator(storage, 'localhost', 9199)
      console.log('🔧 Connected to Storage emulator')
    } catch (error) {
      console.warn('⚠️ Could not connect to emulators:', error)
    }
  }
}

export default { testFirebaseConnection, connectToEmulators }