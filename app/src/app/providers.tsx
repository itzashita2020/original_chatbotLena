/**
 * Providers Component
 *
 * Центральное место для всех context providers
 */

'use client'

import { ReactNode } from 'react'
import { ToastProvider } from '@/components/ui/Toast'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      {children}
    </ToastProvider>
  )
}
