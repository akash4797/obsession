import React, { useState } from "react";
import Image from "next/image";
import { X, Download, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ShowProductImage = ({ imageUrl }: { imageUrl: string }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const openFullScreen = () => {
    setIsFullScreen(true);
  };

  const closeFullScreen = () => {
    setIsFullScreen(false);
  };

  const downloadImage = async () => {
    try {
      // Create a temporary link element
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = `image-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Image download started");
    } catch (error) {
      console.error("Failed to download image:", error);
      toast.error("Failed to download image");
    }
  };

  const copyImage = async () => {
    try {
      if (navigator.clipboard && "write" in navigator.clipboard) {
        // Create an image element to load the image
        const img = new globalThis.Image();
        img.crossOrigin = "anonymous"; // Handle CORS if needed

        // Set up a promise to wait for the image to load
        const imageLoaded = new Promise<HTMLImageElement>((resolve, reject) => {
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error("Failed to load image"));
        });

        // Start loading the image
        img.src = imageUrl;

        // Wait for the image to load
        await imageLoaded;

        // Create a canvas to convert the image to PNG format
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw the image on the canvas
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Failed to get canvas context");
        ctx.drawImage(img, 0, 0);

        // Convert the canvas content to a PNG blob
        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((b) => resolve(b!), "image/png");
        });

        // Copy the PNG blob to clipboard
        await navigator.clipboard.write([
          new ClipboardItem({
            "image/png": blob,
          }),
        ]);

        toast.success("Image copied to clipboard");
      } else {
        // Fallback for browsers that don't support clipboard.write
        toast.info(
          "Your browser doesn't support copying images directly. The image has been opened for download instead."
        );
        downloadImage();
      }
    } catch (error) {
      console.error("Failed to copy image:", error);
      toast.error("Failed to copy image");
    }
  };

  return (
    <div className="relative">
      {/* Thumbnail image that opens the full screen preview when clicked */}
      <div
        className="w-full h-[190px] cursor-pointer rounded-md relative group"
        onClick={openFullScreen}
      >
        <Image
          src={imageUrl}
          alt="Product"
          width={400}
          height={400}
          className="w-full h-full object-contain rounded-md"
          priority
        />
        <div className="absolute bottom-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 bg-gray-800/70 hover:bg-gray-700 text-white rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              copyImage();
            }}
            aria-label="Copy image"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 bg-gray-800/70 hover:bg-gray-700 text-white rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              downloadImage();
            }}
            aria-label="Download image"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Full screen overlay */}
      {isFullScreen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <button
            onClick={closeFullScreen}
            className="absolute top-4 right-4 text-white bg-gray-800 hover:bg-gray-700 rounded-full p-2 z-10"
            aria-label="Close"
          >
            <X />
          </button>
          <div className="relative max-h-screen max-w-full">
            <Image
              src={imageUrl}
              alt="Product full view"
              width={1200}
              height={1200}
              className="max-h-screen max-w-full object-contain"
              priority
            />
            <div className="absolute bottom-4 right-4 flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                className="bg-gray-800/70 hover:bg-gray-700 text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  copyImage();
                }}
              >
                <Copy className="mr-2 h-4 w-4" /> Copy
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="bg-gray-800/70 hover:bg-gray-700 text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  downloadImage();
                }}
              >
                <Download className="mr-2 h-4 w-4" /> Download
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowProductImage;
