/**
 * LoadingSkeleton Component
 *
 * Универсальный skeleton loader для async контента
 */

interface LoadingSkeletonProps {
  variant?: 'text' | 'circle' | 'rect' | 'chat' | 'message'
  width?: string
  height?: string
  className?: string
}

export function LoadingSkeleton({
  variant = 'rect',
  width = '100%',
  height = '20px',
  className = '',
}: LoadingSkeletonProps) {
  const baseClasses = 'animate-pulse bg-gray-200 dark:bg-gray-700'

  if (variant === 'chat') {
    return (
      <div className={`p-3 ${className}`}>
        <div className={`${baseClasses} h-5 w-3/4 rounded mb-2`} />
        <div className={`${baseClasses} h-4 w-1/2 rounded`} />
      </div>
    )
  }

  if (variant === 'message') {
    return (
      <div className={`flex gap-3 ${className}`}>
        <div className={`${baseClasses} h-10 w-10 rounded-full flex-shrink-0`} />
        <div className="flex-1 space-y-2">
          <div className={`${baseClasses} h-4 w-1/4 rounded`} />
          <div className={`${baseClasses} h-4 w-full rounded`} />
          <div className={`${baseClasses} h-4 w-5/6 rounded`} />
        </div>
      </div>
    )
  }

  if (variant === 'circle') {
    return (
      <div
        className={`${baseClasses} rounded-full ${className}`}
        style={{ width, height }}
      />
    )
  }

  if (variant === 'text') {
    return (
      <div
        className={`${baseClasses} rounded ${className}`}
        style={{ width, height }}
      />
    )
  }

  // variant === 'rect'
  return (
    <div
      className={`${baseClasses} rounded-lg ${className}`}
      style={{ width, height }}
    />
  )
}

/**
 * ChatListSkeleton - для списка чатов
 */
export function ChatListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-1 p-2">
      {Array.from({ length: count }).map((_, i) => (
        <LoadingSkeleton key={i} variant="chat" />
      ))}
    </div>
  )
}

/**
 * MessageListSkeleton - для списка сообщений
 */
export function MessageListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4 p-4">
      {Array.from({ length: count }).map((_, i) => (
        <LoadingSkeleton key={i} variant="message" />
      ))}
    </div>
  )
}

/**
 * SettingsPageSkeleton - для Settings page
 */
export function SettingsPageSkeleton() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div>
        <LoadingSkeleton width="200px" height="32px" className="mb-2" />
        <LoadingSkeleton width="400px" height="20px" />
      </div>

      {/* Sections */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
          <LoadingSkeleton width="150px" height="24px" className="mb-4" />
          <div className="space-y-4">
            <LoadingSkeleton height="40px" />
            <LoadingSkeleton height="40px" />
            <LoadingSkeleton height="80px" />
          </div>
        </div>
      ))}
    </div>
  )
}
