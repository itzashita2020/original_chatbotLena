import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'
import { ThemeScript } from '@/components/ThemeScript'

export const metadata: Metadata = {
  title: 'Projekt Lena1 - AI Chat Bot',
  description: 'AI чат-бот с историей и экспортом диалогов',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
