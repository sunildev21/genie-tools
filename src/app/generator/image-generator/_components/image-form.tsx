'use client';  // Ensures client-side rendering

import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button'
interface ImageFormProps {
  setImageUrl: (url: string) => void;
}

const ImageForm: React.FC<ImageFormProps> = ({ setImageUrl }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0',
        { inputs: prompt },
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_HF_TOKEN}`,  // Use environment variable
            'Content-Type': 'application/json',
          },
          responseType: 'blob',  // Get image as blob
        }
      );

      // ✅ Cast the response data as Blob
      const blob = response.data as Blob;
      const url = URL.createObjectURL(blob);
      setImageUrl(url);
    } catch (error) {
      console.error('Error generating image:', error);
      setError('Failed to generate image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter image prompt..."
        className="border p-2 rounded"
      />
      <Button
        onClick={handleGenerate}
        disabled={loading}
        className="bg-pink-600 text-white py-2 rounded hover:bg-blue-600"
      >
        {loading ? 'Generating...' : 'Generate Image'}
      </Button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default ImageForm;
