import React, { useState } from "react";
import Image from "next/image";

const ShowProductImage = ({ imageUrl }: { imageUrl: string }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const openFullScreen = () => {
    setIsFullScreen(true);
  };

  const closeFullScreen = () => {
    setIsFullScreen(false);
  };

  return (
    <div className="relative">
      {/* Thumbnail image that opens the full screen preview when clicked */}
      <div
        className="w-full h-[190px] cursor-pointer rounded-md relative"
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
      </div>

      {/* Full screen overlay */}
      {isFullScreen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <button
            onClick={closeFullScreen}
            className="absolute top-4 right-4 text-white bg-gray-800 hover:bg-gray-700 rounded-full p-2 z-10"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
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
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowProductImage;
