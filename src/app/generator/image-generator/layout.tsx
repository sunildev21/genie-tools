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
        title="Online Image Generator"
        description="Instantly generate images on your input using AI-powered image generation."
      />
      <div className="container mx-auto p-8">
        {children}
      </div>
    </div>
  )
}
