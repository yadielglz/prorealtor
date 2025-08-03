'use client'

import { useEffect, useState } from 'react'
import { testFirebaseConnection, connectToEmulators } from '@/lib/firebase-test'

interface TestResult {
  success: boolean
  services?: {
    app: boolean
    auth: boolean
    firestore: boolean
    storage: boolean
  }
  config?: {
    projectId: string
    authDomain: string
    storageBucket: string
  }
  error?: string
}

export default function FirebaseTestPage() {
  const [testResult, setTestResult] = useState<TestResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function runTest() {
      setIsLoading(true)
      
      // Connect to emulators if in development
      connectToEmulators()
      
      // Test Firebase connection
      const result = await testFirebaseConnection()
      setTestResult(result)
      setIsLoading(false)
    }

    runTest()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Testing Firebase Configuration...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            🔥 Firebase Configuration Test
          </h1>

          {testResult?.success ? (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">
                      Firebase Configuration Successful!
                    </h3>
                    <div className="mt-2 text-sm text-green-700">
                      <p>All Firebase services are properly configured and initialized.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Configuration</h3>
                  <dl className="space-y-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Project ID</dt>
                      <dd className="text-sm text-gray-900 font-mono">{testResult.config?.projectId}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Auth Domain</dt>
                      <dd className="text-sm text-gray-900 font-mono">{testResult.config?.authDomain}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Storage Bucket</dt>
                      <dd className="text-sm text-gray-900 font-mono">{testResult.config?.storageBucket}</dd>
                    </div>
                  </dl>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Services Status</h3>
                  <div className="space-y-2">
                    {Object.entries(testResult.services || {}).map(([service, status]) => (
                      <div key={service} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 capitalize">{service}</span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          status 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {status ? '✅ Active' : '❌ Inactive'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      Next Steps
                    </h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>Your Firebase configuration is working! You can now:</p>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        <li>Set up Firebase Admin SDK credentials for server-side operations</li>
                        <li>Deploy your Firestore security rules</li>
                        <li>Start building your authentication flow</li>
                        <li>Test with Firebase emulators for development</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Firebase Configuration Error
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>There was an error with your Firebase configuration:</p>
                    <p className="mt-1 font-mono bg-red-100 p-2 rounded">
                      {testResult?.error}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              🔄 Retest Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}