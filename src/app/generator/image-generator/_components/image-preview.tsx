'use client';  // Ensures client-side rendering

import React, { useState } from 'react';
import Image from 'next/image';  
import ImageExport from './image-export';  // Import export component
import { Label } from "@/components/ui/label";
interface ImagePreviewProps {
  imageUrl: string;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ imageUrl }) => {
  const [format, setFormat] = useState<string>('png'); // Default format

  return (
    <div className="p-3 border rounded bg-gray-50 dark:bg-gray-200 dark:text-white dark:border-gray-600">
      
      <div className="relative w-full h-[500px]"> 
        
        <Image
          src={imageUrl}
          alt="Generated Image"
          className="w-full h-auto"
          layout="fill"           
          style={{ objectFit: "contain" }}     
          quality={100}
        />
      </div>

      {/* Export Section */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium" style={{color:'black'}}>Export as:</Label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="border px-3 py-1 rounded-md outline-none cursor-pointer"
          >
            <option value="png">PNG</option>
            <option value="jpg">JPG</option>
            <option value="svg">SVG</option>
          </select>
        </div>

        {/* Image Export Component */}
        <ImageExport imageUrl={imageUrl} format={format} />
      </div>
    </div>
  );
};

export default ImagePreview;
