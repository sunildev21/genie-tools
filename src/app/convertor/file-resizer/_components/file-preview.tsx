'use client'

import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface FilePreviewProps {
  file: File
}

export default function FilePreview({ file }: FilePreviewProps) {
  const supportedFormats = [
    'image/jpeg',
    'image/png',
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ]

  const getExtension = (mimeType: string) => {
    if (mimeType === 'image/jpeg') return 'jpg'
    if (mimeType === 'image/png') return 'png'
    if (mimeType === 'application/pdf') return 'pdf'
    if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') return 'docx'
    if (mimeType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') return 'pptx'
    return 'bin'
  }

  const downloadFile = () => {
    if (!file) {
      toast.error('No file to download.')
      return
    }

    const fileType = file.type

    if (!supportedFormats.includes(fileType)) {
      toast.error(`Unsupported file format: ${fileType}`)
      return
    }

    const link = document.createElement('a')
    const fileURL = URL.createObjectURL(file)

    link.href = fileURL
    link.download = file.name || `resized-file.${getExtension(fileType)}`
    link.click()

    URL.revokeObjectURL(fileURL)
    toast.success('File downloaded successfully!')
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-xl font-bold">Resized File Preview</h2>
      <p className="text-gray-500">File ready for download.</p>
      <Button onClick={downloadFile}>Download File</Button>
    </div>
  )
}
