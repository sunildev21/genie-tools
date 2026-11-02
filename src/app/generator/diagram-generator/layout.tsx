'use client'

import { ReactNode } from 'react'
import { Heading } from '@/components/heading'
interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div>
      <Heading
  title="Online Diagram Generator"
  description="Create, visualize, and export diagrams instantly with Mermaid.js."
/>  
      <div className="container mx-auto p-8">
      

        {children}
      </div>
    </div>
  )
}
