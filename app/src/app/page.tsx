/**
 * Home Page - Main Chat Interface
 *
 * Phase 2 implementation: Full-featured AI chat with streaming responses
 * Phase 4: Responsive layout for mobile/tablet/desktop
 * Phase 5: Protected with authentication
 */

'use client'

import { useState, useEffect } from 'react'
import { ChatList, ChatWindow } from '@/modules/chat'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { ResponsiveLayout } from '@/components/layout/ResponsiveLayout'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { UserMenu } from '@/components/layout/UserMenu'

export default function Home() {
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null)
  const [showWarning, setShowWarning] = useState(true)

  useEffect(() => {
    checkApiKey()
  }, [])

  const checkApiKey = async () => {
    try {
      const response = await fetch('/api/settings')
      const data = await response.json()
      setHasApiKey(data.settings?.hasApiKey || false)
    } catch (error) {
      console.error('Failed to check API key:', error)
    }
  }
  return (
    <ProtectedRoute>
      <ErrorBoundary>
        <div className="flex flex-col h-screen overflow-hidden">
          {/* Header with User Menu */}
          <header className="flex-shrink-0 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <div className="flex items-center justify-between px-4 py-3">
              <a
                href="/"
                className="text-xl font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
              >
                AI Chat
              </a>
              <UserMenu />
            </div>
          </header>

          {/* API Key Warning Banner */}
          {hasApiKey === false && showWarning && (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-b-2 border-yellow-400 dark:border-yellow-600 px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1">
                  <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      ⚠️ OpenAI API Key Required
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                      Please add your personal OpenAI API key in Settings to start chatting
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href="/settings"
                    className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
                  >
                    Go to Settings
                  </a>
                  <button
                    onClick={() => setShowWarning(false)}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    aria-label="Dismiss"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 min-h-0">
            <ResponsiveLayout
              sidebar={
                <ErrorBoundary>
                  <ChatList />
                </ErrorBoundary>
              }
              main={
                <ErrorBoundary>
                  <ChatWindow />
                </ErrorBoundary>
              }
            />
          </div>
        </div>
      </ErrorBoundary>
    </ProtectedRoute>
  )
}
