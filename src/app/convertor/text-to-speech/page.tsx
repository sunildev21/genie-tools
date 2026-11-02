"use client"

import { useState } from "react"
import TTSForm from "./_components/tts-form"
import TTSAudioCard from "./_components/tts-audio-card"

export default function TextToSpeechPage() {
  const [text, setText] = useState("")
  const [language, setLanguage] = useState("en-US")
  const [voice, setVoice] = useState("default")
  const [audioSrc, setAudioSrc] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!text.trim()) return

    const res = await fetch("/api/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "textToSpeech",
        text,
        voiceLang: language,
        voice,
      }),
    })

    const data = await res.json()

    if (res.ok && data.audio) {
      setAudioSrc(data.audio) // base64 audio
    } else {
      console.error(data.error || "Unknown error")
      alert("Error generating audio")
    }
  }

  return (
    <div>
      <div className="p-5 bg-#2C0D16-100 min-h-screen">
        <TTSForm
          text={text}
          setText={setText}
          language={language}
          setLanguage={setLanguage}
          voice={voice}
          setVoice={setVoice}
          onGenerate={handleGenerate}
        />
        {audioSrc && <TTSAudioCard audioSrc={audioSrc} />}
      </div>
    </div>
  )
}
