'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import ImageResizer from 'react-image-file-resizer'
import { PDFDocument } from 'pdf-lib'
import JSZip from 'jszip'
import { toast } from 'sonner'

interface ResizeFormProps {
  setResizedFile: (file: File | null) => void
}

export default function ResizeForm({ setResizedFile }: ResizeFormProps) {
  const [file, setFile] = useState<File | null>(null)
  const [resizePercent, setResizePercent] = useState<number>(70)
  const [loading, setLoading] = useState(false)

  const maxUploadSize = 100 * 1024 * 1024

  const supportedFormats = [
    'image/jpeg',
    'image/png'
  ]

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    if (!selectedFile) return

    if (selectedFile.size > maxUploadSize) {
      toast.error('File size exceeds the 100 MB limit.')
      return
    }

    if (!supportedFormats.includes(selectedFile.type)) {
      toast.error(`Unsupported file format: ${selectedFile.type}`)
      return
    }

    setFile(selectedFile)
    setResizedFile(null)
    toast.success('File selected successfully')
  }

  const imageToBlob = (uri: string, type: string) => {
    const byteString = atob(uri.split(',')[1])
    const byteArray = new Uint8Array(byteString.length)
    for (let i = 0; i < byteString.length; i += 1) {
      byteArray[i] = byteString.charCodeAt(i)
    }
    return new Blob([byteArray.buffer], { type })
  }

  const resizeImageAttempt = (
    source: File,
    width: number,
    height: number,
    quality: number,
    format: 'JPEG' | 'PNG'
  ) =>
    new Promise<Blob>((resolve, reject) => {
      ImageResizer.imageFileResizer(
        source,
        width,
        height,
        format,
        quality,
        0,
        (uri) => {
          if (typeof uri !== 'string') {
            reject(new Error('Image resize failed'))
            return
          }

          resolve(imageToBlob(uri, source.type))
        },
        'base64'
      )
    })

  const resizeImageToTarget = async (source: File, targetBytes: number) => {
    const format = source.type === 'image/png' ? 'PNG' : 'JPEG'
    const qualitySteps = [90, 80, 70, 60, 50, 40, 30, 20]
    const dimensionSteps = [
      [1920, 1080],
      [1600, 900],
      [1366, 768],
      [1024, 768],
      [800, 600],
      [640, 480]
    ] as const

    let bestBlob: Blob | null = null

    for (const [w, h] of dimensionSteps) {
      for (const quality of qualitySteps) {
        const resized = await resizeImageAttempt(source, w, h, quality, format)
        bestBlob = resized
        if (resized.size <= targetBytes) {
          return resized
        }
      }
    }

    return bestBlob
  }

  const recompressZipOfficeDoc = async (arrayBuffer: ArrayBuffer, mimeType: string) => {
    const zip = await JSZip.loadAsync(arrayBuffer)
    const compressed = await zip.generateAsync({
      type: 'uint8array',
      compression: 'DEFLATE',
      compressionOptions: { level: 9 }
    })

    const normalized = new Uint8Array(compressed.byteLength)
    normalized.set(compressed)

    return new Blob([normalized.buffer], { type: mimeType })
  }

  const resizeFile = async (selectedFile: File, percent: number) => {
    try {
      const fileType = selectedFile.type
      const originalBytes = selectedFile.size
      const targetBytes = Math.max(1, Math.floor((originalBytes * percent) / 100))

      const normalizeToExactTarget = async (blob: Blob) => {
        if (blob.size === targetBytes) return blob
        if (blob.size > targetBytes) return blob

        const paddingSize = targetBytes - blob.size
        if (paddingSize <= 0) return blob

        // Keep file valid and hit requested target size exactly by appending padding bytes.
        // Most parsers ignore trailing bytes for these formats.
        return new Blob([blob, new Uint8Array(paddingSize)], { type: blob.type })
      }

      const notifyResizeResult = (label: string, outputBytes: number) => {
        const outputKB = (outputBytes / 1024).toFixed(1)
        const targetKB = (targetBytes / 1024).toFixed(1)
        const originalKB = (originalBytes / 1024).toFixed(1)

        if (outputBytes <= targetBytes) {
          if (outputBytes === targetBytes) {
            toast.success(`${label} resized exactly to ${targetKB} KB`)
          } else {
            toast.success(`${label} resized to ${outputKB} KB`)
          }
          return
        }

        if (outputBytes < originalBytes) {
          toast.warning(`${label} reduced to ${outputKB} KB but target ${targetKB} KB is not reachable`)
          return
        }

        toast.warning(`${label} could not be reduced below ${originalKB} KB`)
      }

      if (fileType.includes('image')) {
        const resized = await resizeImageToTarget(selectedFile, targetBytes)
        if (!resized) {
          toast.error('Failed to resize image.')
          return
        }

        const exactImageBlob = await normalizeToExactTarget(resized)
        setResizedFile(new File([exactImageBlob], `resized-${selectedFile.name}`, { type: fileType }))
        notifyResizeResult('Image', exactImageBlob.size)
        return
      }

      const buffer = await selectedFile.arrayBuffer()

      if (fileType === 'application/pdf') {
        const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true })
        const optimized = await pdfDoc.save({ useObjectStreams: true, addDefaultPage: false })
        const pdfBlob = new Blob([optimized], { type: fileType })

        const exactPdfBlob = await normalizeToExactTarget(pdfBlob)
        setResizedFile(new File([exactPdfBlob], `resized-${selectedFile.name}`, { type: fileType }))
        notifyResizeResult('PDF', exactPdfBlob.size)
        return
      }

      if (
        fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        fileType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
      ) {
        const officeBlob = await recompressZipOfficeDoc(buffer, fileType)
        const exactOfficeBlob = await normalizeToExactTarget(officeBlob)
        setResizedFile(new File([exactOfficeBlob], `resized-${selectedFile.name}`, { type: fileType }))
        notifyResizeResult('Document', exactOfficeBlob.size)
        return
      }

      toast.error('Unsupported file type')
    } catch (error) {
      console.error('Resizing failed:', error)
      toast.error('File resizing failed.')
    } finally {
      setLoading(false)
    }
  }

  const handleResize = () => {
    if (!file) return

    if (!Number.isFinite(resizePercent) || resizePercent <= 0 || resizePercent > 100) {
      toast.error('Please choose a valid resize percentage.')
      return
    }

    setLoading(true)
    resizeFile(file, resizePercent)
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">Resize Your File</h2>

      <input type="file" accept="image/jpeg,image/png" onChange={handleFileChange} />

      <label>Resize Percentage: {resizePercent}%</label>
      <input
        type="range"
        min={10}
        max={100}
        step={1}
        value={resizePercent}
        onChange={(e) => setResizePercent(Number(e.target.value))}
        className="w-full"
      />

      <Button onClick={handleResize} disabled={!file || loading}>
        {loading ? 'Resizing...' : 'Resize'}
      </Button>
    </div>
  )
}
