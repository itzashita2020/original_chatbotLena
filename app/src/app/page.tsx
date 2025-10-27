/**
 * Home Page - Main Chat Interface
 *
 * Phase 2 implementation: Full-featured AI chat with streaming responses
 * Phase 4: Responsive layout for mobile/tablet/desktop
 * Phase 5: Protected with authentication
 */

'use client'

import { ChatList, ChatWindow } from '@/modules/chat'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { ResponsiveLayout } from '@/components/layout/ResponsiveLayout'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { UserMenu } from '@/components/layout/UserMenu'

export default function Home() {
  return (
    <ProtectedRoute>
      <ErrorBoundary>
        <div className="flex flex-col h-screen overflow-hidden">
          {/* Header with User Menu */}
          <header className="flex-shrink-0 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <div className="flex items-center justify-between px-4 py-3">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                AI Chat
              </h1>
              <UserMenu />
            </div>
          </header>

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
