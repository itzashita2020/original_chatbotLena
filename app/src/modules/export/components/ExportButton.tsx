'use client'

/**
 * ExportButton Component
 *
 * 🌟 UNIQUE FEATURE - Кнопка экспорта чата с выбором формата
 *
 * Позволяет экспортировать текущий чат в JSON, Markdown или TXT
 */

import { useState } from 'react'
import type { ExportFormat } from '../types'

interface ExportButtonProps {
  chatId: string
  chatTitle?: string
  disabled?: boolean
  className?: string
}

export function ExportButton({
  chatId,
  chatTitle = 'Chat',
  disabled = false,
  className = '',
}: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleExport = async (format: ExportFormat) => {
    setIsExporting(true)
    setError(null)

    try {
      // Build export URL
      const params = new URLSearchParams({
        format,
        includeMetadata: 'true',
        includeTimestamps: 'true',
      })

      const url = `/api/export/${chatId}?${params.toString()}`

      // Fetch the file
      const response = await fetch(url)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Export failed')
      }

      // Get filename from Content-Disposition header
      const contentDisposition = response.headers.get('Content-Disposition')
      let filename = `${chatTitle}-export.${format}`

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="([^"]+)"/)
        if (filenameMatch) {
          filename = filenameMatch[1]
        }
      }

      // Handle PDF differently - open in new tab for printing
      if (format === 'pdf') {
        const htmlContent = await response.text()
        const newWindow = window.open('', '_blank')
        if (newWindow) {
          newWindow.document.write(htmlContent)
          newWindow.document.close()
        } else {
          throw new Error('Please allow popups to export to PDF')
        }
      } else {
        // Download the file for other formats
        const blob = await response.blob()
        const downloadUrl = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = downloadUrl
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(downloadUrl)
      }

      // Close dropdown after successful export
      setIsOpen(false)
    } catch (err) {
      console.error('Export error:', err)
      setError(err instanceof Error ? err.message : 'Export failed')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Main Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled || isExporting}
        className={`
          px-4 py-2 rounded-lg font-medium transition-colors
          ${
            disabled || isExporting
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }
        `}
        aria-label="Export chat"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {isExporting ? 'Exporting...' : 'Export'}
      </button>

      {/* Dropdown Menu */}
      {isOpen && !isExporting && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Menu */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            <div className="py-1">
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase border-b border-gray-200">
                Export Format
              </div>

              <button
                onClick={() => handleExport('json')}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <div className="font-medium">JSON</div>
                <div className="text-xs text-gray-500">Full data structure</div>
              </button>

              <button
                onClick={() => handleExport('markdown')}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <div className="font-medium">Markdown</div>
                <div className="text-xs text-gray-500">Readable documentation</div>
              </button>

              <button
                onClick={() => handleExport('txt')}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <div className="font-medium">Plain Text</div>
                <div className="text-xs text-gray-500">Simple text format</div>
              </button>

              <button
                onClick={() => handleExport('pdf')}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <div className="font-medium">PDF</div>
                <div className="text-xs text-gray-500">Print-ready HTML</div>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Error Message */}
      {error && (
        <div className="absolute right-0 mt-2 w-64 bg-red-50 border border-red-200 rounded-lg p-3 z-20">
          <p className="text-sm text-red-800">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-2 text-xs text-red-600 hover:text-red-800 font-medium"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  )
}
