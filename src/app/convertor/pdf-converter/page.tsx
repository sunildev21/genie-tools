'use client'

import FileUpload from './_components/file-upload'
import PdfOptions from './_components/pdf-options'
import { useState } from 'react'

export default function PDFConverterPage() {
  const [file, setFile] = useState<File | null>(null)
  const [conversionType, setConversionType] = useState<string>('pdf-to-word')

  return (
    <div className="flex flex-col gap-6">
      <FileUpload setFile={setFile} />
      <PdfOptions
        file={file}
        conversionType={conversionType}
        setConversionType={setConversionType}
      />
    </div>
  )
}
