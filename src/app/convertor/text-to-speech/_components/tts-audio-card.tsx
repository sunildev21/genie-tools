"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function TTSAudioCard({ audioSrc }: { audioSrc: string }) {
  return (
    <Card className="mt-6">
      <CardContent className="flex flex-col sm:flex-row justify-between items-center p-4 gap-4">
        <audio controls src={audioSrc} className="w-full" />
        <a href={audioSrc} download="tts-audio.mp3">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </a>
      </CardContent>
    </Card>
  )
}
