import React, { useState } from "react";
import { Button } from '@/components/ui/button'
interface ImageExportProps {
  imageUrl: string;
  format: string;  
}

const ImageExport: React.FC<ImageExportProps> = ({ imageUrl, format }) => {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);

    try {
      const img = new Image();
      img.crossOrigin = "anonymous";  // Ensure CORS handling
      img.src = imageUrl;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (ctx) {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          if (format === "svg") {
            // ✅ Convert to SVG using canvas
            const svg = `
              <svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}">
                <foreignObject width="100%" height="100%">
                  <img xmlns="http://www.w3.org/1999/xhtml" src="${canvas.toDataURL("image/png")}" />
                </foreignObject>
              </svg>`;

            const blob = new Blob([svg], { type: "image/svg+xml" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "exported-image.svg";
            link.click();
            URL.revokeObjectURL(link.href);
          } else {
            // ✅ Export in PNG/JPG
            const link = document.createElement("a");
            link.download = `generated-image.${format}`;
            link.href = canvas.toDataURL(`image/${format}`);
            link.click();
          }
        }
      };
    } catch (error) {
      console.error("Error exporting image:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2 justify-end">
      <Button
        onClick={handleDownload}
        className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-green-400 transition"
        disabled={loading}
        variant='outline'
      >
        {loading ? "Exporting..." : "Export Image"}
      </Button>
    </div>
  );
};

export default ImageExport;
