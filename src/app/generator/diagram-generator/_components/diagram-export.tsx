interface Props {
    diagramData: string
  }
  
  export default function DiagramExport({ diagramData }: Props) {
    const handleDownload = () => {
      console.log('Button clicked')  // ✅ Log button click event
  
      if (!diagramData) {
        console.error('No diagram data available')  // ✅ Log missing data
        return
      }
  
      try {
        const blob = new Blob([diagramData], { type: 'image/svg+xml' })
        console.log('Blob created:', blob)
  
        const url = URL.createObjectURL(blob)
        console.log('Blob URL:', url)
  
        const link = document.createElement('a')
        link.href = url
        link.download = 'diagram.svg'
        link.click()
  
        URL.revokeObjectURL(url)
        console.log('Download triggered')
      } catch (error) {
        console.error('Error downloading diagram:', error)
      }
    }
  
    return (
      <div>
        <button
          onClick={handleDownload}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Export Diagram
        </button>
      </div>
    )
  }
  