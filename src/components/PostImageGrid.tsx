import { useState } from 'react';
import { ZoomIn, Image as ImageIcon } from 'lucide-react';
import { ImageViewerModal } from './ImageViewerModal';

interface PostImageGridProps {
  images?: string[];
  title?: string;
  isCompact?: boolean;
}

export const PostImageGrid = ({ images, title, isCompact = false }: PostImageGridProps) => {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!images || images.length === 0) return null;

  // Enforce max 3 photos visually
  const displayImages = images.slice(0, 3);

  const handleImageClick = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImageIndex(index);
    setViewerOpen(true);
  };

  return (
    <>
      <div className="my-2.5 overflow-hidden rounded-xl border border-slate-200/80 bg-slate-50/50">
        {displayImages.length === 1 && (
          <div
            onClick={(e) => handleImageClick(0, e)}
            className="group relative max-h-72 w-full overflow-hidden cursor-pointer flex items-center justify-center bg-slate-900/5"
          >
            <img
              src={displayImages[0]}
              alt={title || 'Attached study photo'}
              className="max-h-72 w-full object-cover transition-transform duration-200 group-hover:scale-[1.01]"
              loading="lazy"
            />
            <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-md bg-slate-900/70 px-2 py-1 text-[11px] font-medium text-white backdrop-blur-xs opacity-90 group-hover:opacity-100 transition-opacity">
              <ZoomIn className="w-3.5 h-3.5" />
              <span>Click to view</span>
            </div>
          </div>
        )}

        {displayImages.length === 2 && (
          <div className="grid grid-cols-2 gap-1.5 p-1.5">
            {displayImages.map((img, idx) => (
              <div
                key={idx}
                onClick={(e) => handleImageClick(idx, e)}
                className="group relative h-40 sm:h-48 overflow-hidden rounded-lg cursor-pointer bg-slate-900/5"
              >
                <img
                  src={img}
                  alt={`${title || 'Study photo'} ${idx + 1}`}
                  className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                  loading="lazy"
                />
                <div className="absolute bottom-2 right-2 rounded bg-slate-900/70 p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        )}

        {displayImages.length === 3 && (
          <div className="grid grid-cols-3 gap-1.5 p-1.5">
            {displayImages.map((img, idx) => (
              <div
                key={idx}
                onClick={(e) => handleImageClick(idx, e)}
                className="group relative h-32 sm:h-40 overflow-hidden rounded-lg cursor-pointer bg-slate-900/5"
              >
                <img
                  src={img}
                  alt={`${title || 'Study photo'} ${idx + 1}`}
                  className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                  loading="lazy"
                />
                <div className="absolute top-1.5 left-1.5 rounded bg-slate-900/60 px-1.5 py-0.5 text-[9px] font-mono text-white">
                  Photo {idx + 1}/3
                </div>
                <div className="absolute bottom-1.5 right-1.5 rounded bg-slate-900/70 p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="w-3 h-3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Small footer tag showing photo count */}
        <div className="flex items-center justify-between px-3 py-1.5 border-t border-slate-100 bg-white text-[11px] text-slate-500">
          <span className="flex items-center gap-1 font-medium text-slate-700">
            <ImageIcon className="w-3 h-3 text-indigo-600" />
            {displayImages.length} {displayImages.length === 1 ? 'photo attached' : 'photos attached (limit: 3)'}
          </span>
          <span className="text-indigo-600 hover:underline cursor-pointer" onClick={(e) => handleImageClick(0, e)}>
            View full size
          </span>
        </div>
      </div>

      <ImageViewerModal
        images={displayImages}
        initialIndex={selectedImageIndex}
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
        title={title}
      />
    </>
  );
};
