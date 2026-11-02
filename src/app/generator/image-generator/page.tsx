'use client';  // Ensures client-side rendering


import ImageForm from './_components/image-form';
import ImagePreview from './_components/image-preview';
import { useState } from 'react';

const ImageGeneratorPage = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      
      <ImageForm setImageUrl={setImageUrl} />
      {imageUrl && <ImagePreview imageUrl={imageUrl} />}
    </div>
  );
};

export default ImageGeneratorPage;
