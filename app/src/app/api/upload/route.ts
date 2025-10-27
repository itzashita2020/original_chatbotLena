/**
 * Upload API Route
 *
 * POST /api/upload
 *
 * Handles file uploads to Supabase Storage with MIME type fallback
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import PDFParser from 'pdf2json'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = [
  // Images
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  // Documents
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  // Text formats
  'text/plain',
  'text/markdown',
  'text/csv',
  'application/vnd.ms-excel', // CSV files sometimes come with this MIME type
  'text/html',
  'text/xml',
  'application/xml',
  'application/json',
]

/**
 * Extract text content from different file types
 * @param file - The file to extract text from
 * @param mimeType - Optional MIME type override (for fallback detection)
 */
async function extractTextFromFile(file: File, mimeType?: string): Promise<string | null> {
  try {
    const fileBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(fileBuffer)

    // Use provided MIME type or fall back to file.type
    const effectiveType = mimeType || file.type

    // PDF files
    if (effectiveType === 'application/pdf') {
      console.log('📄 Extracting text from PDF...')
      return new Promise((resolve) => {
        const pdfParser = new PDFParser()

        pdfParser.on('pdfParser_dataError', (errData: any) => {
          console.error('PDF parsing error:', errData.parserError)
          resolve(null)
        })

        pdfParser.on('pdfParser_dataReady', (pdfData: any) => {
          try {
            console.log('📊 PDF data structure:', {
              hasPages: !!pdfData.Pages,
              pageCount: pdfData.Pages?.length || 0,
              firstPageHasTexts: !!pdfData.Pages?.[0]?.Texts,
              firstPageTextCount: pdfData.Pages?.[0]?.Texts?.length || 0
            })

            // Extract text from all pages
            let text = ''
            if (pdfData.Pages && pdfData.Pages.length > 0) {
              for (let i = 0; i < pdfData.Pages.length; i++) {
                const page = pdfData.Pages[i]
                if (page.Texts && page.Texts.length > 0) {
                  for (const textItem of page.Texts) {
                    if (textItem.R && textItem.R.length > 0) {
                      for (const run of textItem.R) {
                        if (run.T) {
                          try {
                            // Try to decode URI component
                            const decoded = decodeURIComponent(run.T)
                            text += decoded + ' '
                          } catch (decodeError) {
                            // If decoding fails, use text as-is
                            text += run.T + ' '
                          }
                        }
                      }
                    }
                  }
                  text += '\n'
                } else {
                  console.log(`⚠️ Page ${i + 1} has no text content`)
                }
              }
            } else {
              console.log('⚠️ PDF has no pages or Pages array is empty')
            }

            const extractedText = text.trim()
            if (extractedText && extractedText.length > 0) {
              console.log(`✅ Extracted ${extractedText.length} characters from PDF`)
              console.log('First 200 chars:', extractedText.substring(0, 200))
              resolve(extractedText)
            } else {
              console.log('⚠️ No text extracted from PDF (likely scanned image)')
              console.log('💡 Tip: For scanned documents, upload as JPG/PNG - gpt-4o can read text from images!')
              // Return a helpful message for the user
              resolve('⚠️ This PDF appears to be a scanned image without text layer. To read scanned documents, please upload them as image files (JPG, PNG) instead - the AI can read text directly from images using vision capabilities.')
            }
          } catch (error) {
            console.error('Error processing PDF data:', error)
            resolve(null)
          }
        })

        pdfParser.parseBuffer(buffer)
      })
    }

    // DOCX files
    if (effectiveType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      console.log('📝 Extracting text from DOCX...')
      const mammoth = await import('mammoth')
      const result = await mammoth.extractRawText({ buffer })
      return result.value
    }

    // DOC files (old Word format)
    if (effectiveType === 'application/msword') {
      console.log('📝 Extracting text from DOC...')
      // mammoth can handle .doc files too, but with limited support
      const mammoth = await import('mammoth')
      const result = await mammoth.extractRawText({ buffer })
      return result.value
    }

    // JSON files - format for better readability
    if (effectiveType === 'application/json') {
      console.log('📊 Reading JSON file...')
      const text = new TextDecoder('utf-8').decode(buffer)
      try {
        // Try to parse and format JSON
        const json = JSON.parse(text)
        return `JSON File:\n${JSON.stringify(json, null, 2)}`
      } catch (error) {
        // If parsing fails, return as-is
        console.log('⚠️ JSON parsing failed, returning raw text')
        return `JSON File (raw):\n${text}`
      }
    }

    // CSV files (can come as text/csv or application/vnd.ms-excel)
    if (effectiveType === 'text/csv' || effectiveType === 'application/vnd.ms-excel') {
      console.log('📈 Reading CSV file...')

      // Try to decode with UTF-8 first, then fall back to Windows-1251 (common for Russian CSV)
      try {
        const utf8Text = new TextDecoder('utf-8', { fatal: true }).decode(buffer)
        console.log('✅ CSV decoded as UTF-8')
        return `CSV File:\n${utf8Text}`
      } catch (error) {
        // UTF-8 failed, try Windows-1251 (common encoding for Russian Excel CSV files)
        console.log('⚠️ UTF-8 failed, trying Windows-1251...')
        const win1251Text = new TextDecoder('windows-1251').decode(buffer)
        console.log('✅ CSV decoded as Windows-1251')
        return `CSV File:\n${win1251Text}`
      }
    }

    // XML files
    if (effectiveType === 'text/xml' || effectiveType === 'application/xml') {
      console.log('📋 Reading XML file...')
      const text = new TextDecoder('utf-8').decode(buffer)
      return `XML File:\n${text}`
    }

    // HTML files
    if (effectiveType === 'text/html') {
      console.log('🌐 Reading HTML file...')
      const text = new TextDecoder('utf-8').decode(buffer)
      return `HTML File:\n${text}`
    }

    // Plain text and Markdown files
    if (effectiveType === 'text/plain' || effectiveType === 'text/markdown') {
      console.log('📃 Reading text file...')
      const text = new TextDecoder('utf-8').decode(buffer)
      return text
    }

    // Images - no text extraction
    if (effectiveType.startsWith('image/')) {
      return null
    }

    console.log('⚠️ Unsupported file type for text extraction:', effectiveType)
    return null
  } catch (error) {
    console.error('Failed to extract text from file:', error)
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const messageId = formData.get('messageId') as string
    const chatId = formData.get('chatId') as string

    console.log('📤 Upload Request:', {
      hasFile: !!file,
      fileName: file?.name,
      fileSize: file?.size,
      fileType: file?.type,
      messageId,
      chatId
    })

    if (!file) {
      console.log('❌ No file provided')
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!messageId || !chatId) {
      console.log('❌ Missing messageId or chatId')
      return NextResponse.json({ error: 'messageId and chatId are required' }, { status: 400 })
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 400 }
      )
    }

    // Get file extension for fallback detection
    const fileExt = file.name.split('.').pop()?.toLowerCase() || ''

    // MIME type fallback map for files that may have incorrect MIME types
    const extensionToMimeType: Record<string, string> = {
      'csv': 'application/vnd.ms-excel', // Prefer Excel MIME type for CSV as it's more common
      'json': 'application/json',
      'xml': 'text/xml',
      'html': 'text/html',
      'txt': 'text/plain',
      'md': 'text/markdown',
      'pdf': 'application/pdf',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
    }

    // Check if file type is allowed, with fallback to extension-based detection
    let effectiveFileType = file.type

    // If MIME type is generic or empty, try to determine from extension
    if (!file.type || file.type === 'application/octet-stream' || file.type === '') {
      const mappedType = extensionToMimeType[fileExt]
      if (mappedType) {
        console.log(`📝 MIME type fallback: .${fileExt} → ${mappedType}`)
        effectiveFileType = mappedType
      }
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(effectiveFileType)) {
      console.log(`❌ File type not allowed: ${effectiveFileType} (extension: .${fileExt})`)
      return NextResponse.json(
        { error: 'File type not allowed. Allowed types: images, PDF, text documents' },
        { status: 400 }
      )
    }

    console.log(`✅ File type accepted: ${effectiveFileType}`)

    // Generate unique file name
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const storagePath = `${user.id}/${chatId}/${fileName}`

    // Upload to Supabase Storage
    const fileBuffer = await file.arrayBuffer()
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('chat-attachments')
      .upload(storagePath, fileBuffer, {
        contentType: effectiveFileType, // Use effective type for proper content handling
        upsert: false,
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('chat-attachments')
      .getPublicUrl(storagePath)

    // Get image dimensions if it's an image
    const width: number | null = null
    const height: number | null = null

    if (file.type.startsWith('image/')) {
      // For images, we'll let the client handle dimensions
      // Could use sharp library here for server-side processing
    }

    // Extract text content from documents
    let extractedText: string | null = null
    if (!effectiveFileType.startsWith('image/')) {
      extractedText = await extractTextFromFile(file, effectiveFileType)
      if (extractedText) {
        console.log('✅ Extracted text:', extractedText.substring(0, 100) + '...')
      }
    }

    // Save attachment metadata to database
    const { data: attachment, error: dbError } = await supabase
      .from('message_attachments')
      .insert({
        message_id: messageId,
        file_name: file.name,
        file_type: effectiveFileType, // Use effective type for consistency
        file_size: file.size,
        storage_path: storagePath,
        thumbnail_url: effectiveFileType.startsWith('image/') ? publicUrl : null,
        width,
        height,
        metadata: extractedText ? { extracted_text: extractedText } : null,
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      // Clean up uploaded file
      await supabase.storage.from('chat-attachments').remove([storagePath])
      return NextResponse.json({ error: 'Failed to save attachment metadata' }, { status: 500 })
    }

    return NextResponse.json(
      {
        attachment: {
          ...attachment,
          url: publicUrl,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to upload file' },
      { status: 500 }
    )
  }
}
