'use client'

import { useState } from 'react'
import mermaid from 'mermaid'

interface Props {
  onGenerate: (svg: string) => void
}

export default function DiagramForm({ onGenerate }: Props) {
  const [diagramCode, setDiagramCode] = useState<string>('')

  const handleGenerate = async () => {
    try {
      const { svg } = await mermaid.render('graphDiv', diagramCode)
      onGenerate(svg)  // Pass only `svg`
    } catch (error) {
      console.error('Failed to generate diagram:', error)
    }
  }

  return (
    <div>
      <textarea
        value={diagramCode}
        onChange={(e) => setDiagramCode(e.target.value)}
        placeholder="Enter Mermaid diagram code..."
        className="w-full h-40 p-3 border rounded bg-gray-50 dark:bg-gray-800 dark:text-white dark:border-gray-600"
      />
      <button
        onClick={handleGenerate}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Generate Diagram
      </button>
    </div>
  )
}
