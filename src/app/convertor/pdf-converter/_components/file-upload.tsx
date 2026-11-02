'use client'

import { Button } from '@/components/ui/button'

interface FileUploadProps {
  setFile: (file: File | null) => void
}

export default function FileUpload({ setFile }: FileUploadProps) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null
    setFile(selectedFile)
  }

  return (
    <div className="flex gap-4 items-center">
      <input type="file" accept=".pdf, .docx, .pptx" onChange={handleFileChange} />
      <Button>Upload File</Button>
    </div>
  )
}
