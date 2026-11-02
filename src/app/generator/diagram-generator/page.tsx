'use client'

import { useState } from 'react'
import DiagramForm from './_components/diagram-form'
import DiagramPreview from './_components/diagram-preview'
import DiagramExport from './_components/diagram-export'

export default function DiagramPage() {
  const [diagramData, setDiagramData] = useState<string>('')

  // Use only one parameter (svg)
  const handleGenerate = (svg: string) => {
    setDiagramData(svg)
  }

  return (
    <div className="space-y-8">
      {/* Form Component */}
      <DiagramForm onGenerate={handleGenerate} />

      {/* Preview Component */}
      {diagramData && <DiagramPreview diagramData={diagramData} />}

      {/* Export Component */}
      {diagramData && <DiagramExport diagramData={diagramData} />}
    </div>
  )
}
