'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

interface FlipWordsProps {
  words: { text: string; className: string }[]
  duration: number
  delay: number
}

function FlipWords({ words, duration, delay }: FlipWordsProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length)
      }, (duration * 1000) / words.length)

      return () => clearInterval(interval)
    }, delay * 1000)

    return () => clearTimeout(timeout)
  }, [duration, delay, words.length])

  return (
    <span className={`inline-block ml-2 ${words[currentIndex].className}`} style={{ transition: `opacity ${duration}s` }}>
      {words[currentIndex].text}
    </span>
  )
}

const WORDS = [
  { text: 'Convertor', className: 'bg-clip-text text-transparent bg-gradient-to-r from-[#ff1835] to-[#ffc900]' },
  { text: 'Calculator', className: 'bg-clip-text text-transparent bg-gradient-to-r from-[#0077ff] to-[#00e7df]' },
  { text: 'Generator', className: 'bg-clip-text text-transparent bg-gradient-to-r from-[#7f00de] to-[#ff007f]' },
  { text: 'Tester', className: 'bg-clip-text text-transparent bg-gradient-to-r from-[#26b868] to-[#1cb2e0]' },
  { text: 'Compiler', className: 'bg-clip-text text-transparent bg-gradient-to-r from-[#ff8c00] to-[#d500f9]' }
]

export function Hero() {
  return (
    <div className='my-12 space-y-8'>
      <motion.div
        className='will-change-[transform,opacity] space-y-4'
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }} // Smooth entrance animation
      >
        <h1 className='text-2xl md:text-4xl font-bold tracking-wide flex items-center'>
          <span>Collection of</span>
          <FlipWords words={WORDS} duration={5} delay={1} />
        </h1>
        <p className='leading-6 text-muted-foreground tracking-wide'>
          Here is a collection of online free tools I have frequently used.
        </p>
        <Button variant='gooeyLeft' size='lg' className='text-lg font-semibold tracking-wider'>
          <Link href='#get-started'>Get Started</Link>
        </Button>
      </motion.div>
    </div>
  )
}
