import { ReactNode } from 'react'
import { Heading } from "@/components/heading"
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="p-6 max-w-4xl mx-auto">
     <Heading
  title="File Resizer"
  description="Resize your files to reduce their size while maintaining quality. Supported formats: JPEG, PNG "
/>

      {children}
    </div>
  )
}
