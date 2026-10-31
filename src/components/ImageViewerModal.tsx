import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface ImageViewerModalProps {
  images: string[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export const ImageViewerModal = ({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
  title,
}: ImageViewerModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);

  if (!isOpen || images.length === 0) return null;

  const currentImg = images[currentIndex] || images[0];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsZoomed(false);
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsZoomed(false);
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  return (
    <div
      className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex flex-col items-center justify-between p-3 sm:p-6"
      onClick={onClose}
    >
      {/* Top bar */}
      <div
        className="w-full max-w-5xl flex items-center justify-between text-white/90 py-2 shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <span className="font-semibold text-sm truncate max-w-xs sm:max-w-md">
            {title || 'Study Diagram / Photo'}
          </span>
          {images.length > 1 && (
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-mono">
              {currentIndex + 1} / {images.length}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsZoomed((prev) => !prev)}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title={isZoomed ? 'Zoom Out' : 'Zoom In'}
          >
            {isZoomed ? <ZoomOut className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Close viewer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Image Stage */}
      <div
        className="relative flex-1 w-full max-w-5xl flex items-center justify-center overflow-auto p-2"
        onClick={(e) => e.stopPropagation()}
      >
        {images.length > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-2 sm:left-4 z-10 p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/20 transition-all hover:scale-105 cursor-pointer"
            title="Previous photo"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        <img
          src={currentImg}
          alt={title || 'Study photo'}
          className={`rounded-lg object-contain transition-all duration-200 select-none ${
            isZoomed
              ? 'max-h-none max-w-none scale-125 cursor-zoom-out'
              : 'max-h-[75vh] max-w-full cursor-zoom-in shadow-2xl'
          }`}
          onClick={() => setIsZoomed((prev) => !prev)}
        />

        {images.length > 1 && (
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-2 sm:right-4 z-10 p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/20 transition-all hover:scale-105 cursor-pointer"
            title="Next photo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Bottom Thumbnail Strip (if multiple photos) */}
      {images.length > 1 && (
        <div
          className="flex items-center gap-2 py-2 shrink-0 overflow-x-auto max-w-full"
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setCurrentIndex(idx);
                setIsZoomed(false);
              }}
              className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                currentIndex === idx
                  ? 'border-indigo-400 scale-105 ring-2 ring-indigo-400/50'
                  : 'border-white/30 opacity-60 hover:opacity-100'
              }`}
            >
              <img src={img} alt={`thumb-${idx}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
