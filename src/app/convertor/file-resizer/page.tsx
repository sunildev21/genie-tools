'use client'

import { useState } from 'react'
import ResizeForm from './_components/resize-form'
import FilePreview from './_components/file-preview'

export default function FileResizerPage() {
  const [resizedFile, setResizedFile] = useState<File | null>(null)

  return (
    <div className="container mx-auto p-8">
      <ResizeForm setResizedFile={setResizedFile} />
      {resizedFile && <FilePreview file={resizedFile} />}
    </div>
  )
}
