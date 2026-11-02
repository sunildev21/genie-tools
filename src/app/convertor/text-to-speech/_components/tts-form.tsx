"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/text-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Play } from "lucide-react"

type Props = {
  text: string
  setText: (val: string) => void
  language: string
  setLanguage: (val: string) => void
  voice: string
  setVoice: (val: string) => void
  onGenerate: () => void
}

export default function TTSForm({
  text,
  setText,
  language,
  setLanguage,
  voice,
  setVoice,
  onGenerate,
}: Props) {
  return (
    <Card className="shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Text to Speech Converter</CardTitle>
        <CardDescription className="text-center">
          Convert your text to natural-sounding speech in seconds
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="text">Text</Label>
          <Textarea
            id="text"
            placeholder="Enter the text you want to convert to speech..."
            className="min-h-[120px] resize-y"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger id="language">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {/* Global languages */}
                <SelectItem value="en-US">English (US)</SelectItem>
                <SelectItem value="en-GB">English (UK)</SelectItem>
                <SelectItem value="es-ES">Spanish</SelectItem>
                <SelectItem value="fr-FR">French</SelectItem>
                <SelectItem value="de-DE">German</SelectItem>
                <SelectItem value="ja-JP">Japanese</SelectItem>
                <SelectItem value="zh-CN">Chinese</SelectItem>

                {/* Indian Languages */}
                <SelectItem value="en-IN">English (India)</SelectItem>
                <SelectItem value="hi-IN">Hindi</SelectItem>
                <SelectItem value="ta-IN">Tamil</SelectItem>
                <SelectItem value="te-IN">Telugu</SelectItem>
                <SelectItem value="ml-IN">Malayalam</SelectItem>
                <SelectItem value="bn-IN">Bengali</SelectItem>
                <SelectItem value="gu-IN">Gujarati</SelectItem>
                <SelectItem value="kn-IN">Kannada</SelectItem>
                <SelectItem value="mr-IN">Marathi</SelectItem>
                <SelectItem value="pa-IN">Punjabi</SelectItem>
                <SelectItem value="ur-IN">Urdu</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="voice">Voice</Label>
            <Select value={voice} onValueChange={setVoice}>
              <SelectTrigger id="voice">
                <SelectValue placeholder="Select voice" />
              </SelectTrigger>
              <SelectContent>
                {/* Global Voices */}
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="male1">Male 1</SelectItem>
                <SelectItem value="female1">Female 1</SelectItem>

                {/* Indian Voices */}
                <SelectItem value="en-IN-male">English (India) - Male</SelectItem>
                <SelectItem value="en-IN-female">English (India) - Female</SelectItem>
                <SelectItem value="hi-IN-male">Hindi - Male</SelectItem>
                <SelectItem value="hi-IN-female">Hindi - Female</SelectItem>
                <SelectItem value="ta-IN-female">Tamil - Female</SelectItem>
                <SelectItem value="te-IN-female">Telugu - Female</SelectItem>
                <SelectItem value="ml-IN-female">Malayalam - Female</SelectItem>
                <SelectItem value="bn-IN-female">Bengali - Female</SelectItem>
                <SelectItem value="gu-IN-female">Gujarati - Female</SelectItem>
                <SelectItem value="kn-IN-female">Kannada - Female</SelectItem>
                <SelectItem value="mr-IN-female">Marathi - Female</SelectItem>
                <SelectItem value="pa-IN-female">Punjabi - Female</SelectItem>
                <SelectItem value="ur-IN-female">Urdu - Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-end">
        <Button onClick={onGenerate} disabled={!text.trim()}>
          <Play className="mr-2 h-4 w-4" />
          Generate
        </Button>
      </CardFooter>
    </Card>
  )
}
