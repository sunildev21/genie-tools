'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { PDFDocument, rgb } from 'pdf-lib'
import { saveAs } from 'file-saver'
import mammoth from 'mammoth'
import pptxgen from 'pptxgenjs'

interface PdfOptionsProps {
  file: File | null
  conversionType: string
  setConversionType: (type: string) => void
}

export default function PdfOptions({ file, conversionType, setConversionType }: PdfOptionsProps) {
  const [loading, setLoading] = useState(false)

  const extractTextFromPdfLib = async (arrayBuffer: ArrayBuffer): Promise<string> => {
    const pdfDoc = await PDFDocument.load(arrayBuffer)
    const pages = pdfDoc.getPages()
    let text = ''

    for (const page of pages) {
      const { width, height } = page.getSize()
      const pageText = `Page ${pages.indexOf(page) + 1} - Size: ${width}x${height}\n`
      text += pageText
    }

    return text
  }

  const convertWordToPdf = async (arrayBuffer: ArrayBuffer) => {
    const result = await mammoth.convertToHtml({ buffer: Buffer.from(arrayBuffer) })
    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([600, 400])

    page.drawText(result.value, {
      x: 50,
      y: 350,
      size: 12,
      color: rgb(0, 0, 0)
    })

    const pdfBytes = await pdfDoc.save()
    const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' })
    saveAs(pdfBlob, 'converted.pdf')
  }

  const convertPptToPdf = async () => {
    const ppt = new pptxgen()
    ppt.addSlide().addText('Converted from PPT', { x: 1, y: 1 })
    await ppt.writeFile({ fileName: 'converted.pdf' })
  }

  const handleConversion = async () => {
    if (!file) return

    setLoading(true)

    const reader = new FileReader()

    reader.onload = async (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer

      try {
        switch (conversionType) {
          case 'pdf-to-word': {
            const pdfText = await extractTextFromPdfLib(arrayBuffer)
            const docBlob = new Blob([pdfText], { type: 'application/msword' })
            saveAs(docBlob, 'converted.docx')
            break
          }

          case 'word-to-pdf': {
            await convertWordToPdf(arrayBuffer)
            break
          }

          case 'ppt-to-pdf': {
            await convertPptToPdf()
            break
          }

          default:
            console.error('Unsupported conversion type')
        }
      } catch (error) {
        console.error('Conversion failed:', error)
      } finally {
        setLoading(false)
      }
    }

    reader.readAsArrayBuffer(file)
  }

  return (
    <div className="flex flex-col gap-4">
      <select value={conversionType} onChange={(e) => setConversionType(e.target.value)}>
        <option value="pdf-to-word">PDF to Word</option>
        <option value="word-to-pdf">Word to PDF</option>
        <option value="ppt-to-pdf">PPT to PDF</option>
      </select>

      <Button onClick={handleConversion} disabled={!file || loading}>
        {loading ? 'Converting...' : 'Convert'}
      </Button>
    </div>
  )
}
