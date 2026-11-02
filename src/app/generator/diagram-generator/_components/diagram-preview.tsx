interface Props {
  diagramData: string
}

export default function DiagramPreview({ diagramData }: Props) {
  return (
    <div className="mt-4 p-3 border rounded bg-gray-50 dark:bg-gray-200 dark:text-white dark:border-gray-600">
      <div dangerouslySetInnerHTML={{ __html: diagramData }} />
    </div>
  )
}
