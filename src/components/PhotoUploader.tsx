import { useState, useRef } from 'react';
import { Image as ImageIcon, X, Plus, AlertCircle, Sparkles, Link as LinkIcon } from 'lucide-react';
import { MAX_PHOTO_LIMIT, processImageFile } from '../utils/imageUtils';

interface PhotoUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  label?: string;
  helperText?: string;
}

export const PhotoUploader = ({
  images,
  onChange,
  label = 'Attached Photos',
  helperText = 'Add up to 3 photos (textbook diagrams, notes, equations, question paper)',
}: PhotoUploaderProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInputValue, setUrlInputValue] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canAddMore = images.length < MAX_PHOTO_LIMIT;
  const remainingSlots = MAX_PHOTO_LIMIT - images.length;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setError(null);

    if (files.length > remainingSlots) {
      setError(`You can only add up to ${MAX_PHOTO_LIMIT} photos in total. (Limit: ${MAX_PHOTO_LIMIT})`);
    }

    setIsProcessing(true);
    const newImages: string[] = [];

    // Process only up to the allowed remaining slots
    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    for (const file of filesToProcess) {
      try {
        const compressed = await processImageFile(file);
        newImages.push(compressed);
      } catch (err: any) {
        setError(err.message || 'Failed to process an image file.');
      }
    }

    if (newImages.length > 0) {
      onChange([...images, ...newImages]);
    }

    setIsProcessing(false);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInputValue.trim()) return;

    if (!canAddMore) {
      setError(`You have reached the maximum limit of ${MAX_PHOTO_LIMIT} photos.`);
      return;
    }

    onChange([...images, urlInputValue.trim()]);
    setUrlInputValue('');
    setShowUrlInput(false);
    setError(null);
  };

  const handleRemoveImage = (indexToRemove: number) => {
    onChange(images.filter((_, idx) => idx !== indexToRemove));
    setError(null);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />
          <span>{label}</span>
          <span
            className={`text-[11px] font-bold px-1.5 py-0.2 rounded-md ${
              images.length === MAX_PHOTO_LIMIT
                ? 'bg-amber-100 text-amber-800'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {images.length} / {MAX_PHOTO_LIMIT}
          </span>
        </label>

        {images.length === MAX_PHOTO_LIMIT && (
          <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/80">
            Photo limit reached (Max 3)
          </span>
        )}
      </div>

      {helperText && <p className="text-[11px] text-slate-400">{helperText}</p>}

      {error && (
        <div className="flex items-center gap-1.5 p-2 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Grid of uploaded images + Add button */}
      <div className="flex flex-wrap gap-2.5 items-center">
        {images.map((img, idx) => (
          <div
            key={idx}
            className="relative group w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shadow-2xs"
          >
            <img src={img} alt={`Attached ${idx + 1}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => handleRemoveImage(idx)}
              className="absolute top-1 right-1 p-1 bg-slate-900/70 hover:bg-rose-600 text-white rounded-full transition-colors shadow-xs"
              title="Remove this photo"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <div className="absolute bottom-1 left-1 bg-slate-900/60 text-white text-[9px] font-mono px-1 rounded">
              #{idx + 1}
            </div>
          </div>
        ))}

        {/* Upload Button (hidden if 3 photos reached) */}
        {canAddMore && (
          <div className="flex items-center gap-1.5">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
              id="photo-file-upload-input"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="w-20 h-20 sm:w-24 sm:h-24 border-2 border-dashed border-slate-300 hover:border-indigo-500 hover:bg-indigo-50/50 rounded-lg flex flex-col items-center justify-center gap-1 text-slate-500 hover:text-indigo-600 transition-all cursor-pointer disabled:opacity-50"
              title={`Upload photo (${remainingSlots} remaining, max ${MAX_PHOTO_LIMIT})`}
            >
              {isProcessing ? (
                <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  <span className="text-[10px] font-semibold">Add Photo</span>
                  <span className="text-[9px] text-slate-400">({remainingSlots} left)</span>
                </>
              )}
            </button>

            {/* Optional URL button */}
            {!showUrlInput && (
              <button
                type="button"
                onClick={() => setShowUrlInput(true)}
                className="text-[11px] text-slate-500 hover:text-indigo-600 underline px-1 py-1"
                title="Paste image link"
              >
                or URL
              </button>
            )}
          </div>
        )}
      </div>

      {/* URL input field if toggled */}
      {showUrlInput && canAddMore && (
        <form onSubmit={handleAddUrl} className="flex gap-2 pt-1">
          <input
            type="url"
            placeholder="Paste image URL (e.g. https://...)"
            value={urlInputValue}
            onChange={(e) => setUrlInputValue(e.target.value)}
            className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500"
          />
          <button
            type="submit"
            className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => setShowUrlInput(false)}
            className="px-2 py-1.5 text-slate-500 text-xs hover:text-slate-700"
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};
