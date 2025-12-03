import React, { useRef, useState } from 'react';

interface ImageUploadProps {
  label: string;
  multiple?: boolean;
  maxFiles?: number;
  value: File[];
  onChange: (files: File[]) => void;
  existingImages?: string[];
  onRemoveExisting?: (index: number) => void;
  error?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  label,
  multiple = false,
  maxFiles = 10,
  value,
  onChange,
  existingImages = [],
  onRemoveExisting,
  error,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);

  // Generate previews when files change
  React.useEffect(() => {
    const newPreviews: string[] = [];
    value.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === value.length) {
          setPreviews([...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });
    if (value.length === 0) {
      setPreviews([]);
    }
  }, [value]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith('image/')
    );

    if (multiple) {
      const totalFiles = value.length + existingImages.length + droppedFiles.length;
      if (totalFiles > maxFiles) {
        alert(`Maximum ${maxFiles} images allowed`);
        return;
      }
      onChange([...value, ...droppedFiles]);
    } else {
      onChange(droppedFiles.slice(0, 1));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    if (multiple) {
      const totalFiles = value.length + existingImages.length + selectedFiles.length;
      if (totalFiles > maxFiles) {
        alert(`Maximum ${maxFiles} images allowed`);
        return;
      }
      onChange([...value, ...selectedFiles]);
    } else {
      onChange(selectedFiles.slice(0, 1));
    }
  };

  const removeFile = (index: number) => {
    const newFiles = value.filter((_, i) => i !== index);
    onChange(newFiles);
  };

  const totalImages = value.length + existingImages.length;
  const canAddMore = multiple ? totalImages < maxFiles : totalImages === 0;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      {/* Existing Images */}
      {existingImages.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-2">
          {existingImages.map((url, idx) => (
            <div key={`existing-${idx}`} className="relative group">
              <img
                src={url}
                alt={`Existing ${idx + 1}`}
                className="w-full h-24 object-cover rounded-lg border border-gray-200"
              />
              {onRemoveExisting && (
                <button
                  type="button"
                  onClick={() => onRemoveExisting(idx)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              )}
              <span className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1 rounded">
                Saved
              </span>
            </div>
          ))}
        </div>
      )}

      {/* New File Previews */}
      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-2">
          {previews.map((preview, idx) => (
            <div key={`preview-${idx}`} className="relative group">
              <img
                src={preview}
                alt={`Preview ${idx + 1}`}
                className="w-full h-24 object-cover rounded-lg border border-indigo-200"
              />
              <button
                type="button"
                onClick={() => removeFile(idx)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
              <span className="absolute bottom-1 left-1 bg-indigo-500 text-white text-xs px-1 rounded">
                New
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      {canAddMore && (
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            dragActive
              ? 'border-indigo-500 bg-indigo-50'
              : error
              ? 'border-red-300 bg-red-50'
              : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple={multiple}
            onChange={handleChange}
            className="hidden"
          />
          
          <div className="space-y-2">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="text-sm text-gray-600">
              <span className="text-indigo-600 font-medium">Click to upload</span> or drag and drop
            </div>
            <p className="text-xs text-gray-500">
              PNG, JPG, WEBP up to 5MB
              {multiple && ` (${totalImages}/${maxFiles} images)`}
            </p>
          </div>
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default ImageUpload;