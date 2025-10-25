// components/ImageLightbox.tsx
import React, { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

interface ImageLightboxProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
}

const ImageLightbox: React.FC<ImageLightboxProps> = ({
  src,
  alt,
  width = 1000,
  height = 500,
  priority = false,
  className = "w-full h-auto",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Thumbnail Image */}
      <div
        className="relative rounded-lg overflow-hidden shadow-md cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={`${className} transition-transform hover:scale-105 object-contain`}
          priority={priority}
          loading={priority ? "eager" : "lazy"}
        />
      </div>

      {/* Lightbox Modal */}
      <Lightbox
        open={isOpen}
        close={() => setIsOpen(false)}
        slides={[
          {
            src,
            width: 1920,
            height: 1080,
          },
        ]}
        plugins={[Zoom]}
        zoom={{
          maxZoomPixelRatio: 3,
          scrollToZoom: true,
          doubleClickMaxStops: 2,
          doubleClickDelay: 300,
        }}
        carousel={{
          finite: true, // Non-looping carousel
        }}
        styles={{
          container: { backgroundColor: "rgba(0, 0, 0, 0.9)" },
          root: { "--yarl__color_backdrop": "rgba(0, 0, 0, 0.9)" },
        }}
        render={{
          buttonPrev: () => null, // Remove Prev Button
          buttonNext: () => null, // Remove Next Button
        }}
      />
    </>
  );
};

export default ImageLightbox;
