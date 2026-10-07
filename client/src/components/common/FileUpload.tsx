import React, { useState, useRef } from 'react';
import { UploadCloud, X, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  error?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  selectedFile,
  error: externalError,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSizeBytes = 5 * 1024 * 1024; // 5MB

  const handleFile = (file: File) => {
    setInternalError(null);

    if (!allowedTypes.includes(file.type.toLowerCase())) {
      setInternalError('Invalid file format. Please upload a JPG, JPEG, PNG, or WEBP image.');
      return;
    }

    if (file.size > maxSizeBytes) {
      setInternalError('File is too large. Maximum allowed size is 5MB.');
      return;
    }

    onFileSelect(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

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

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    onFileSelect(null);
    setPreviewUrl(null);
    setInternalError(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const displayError = externalError || internalError;

  return (
    <div className="w-full">
      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp"
        onChange={handleChange}
        className="hidden"
      />

      {previewUrl || selectedFile ? (
        <div className="relative border-2 border-dashed border-cyber-cyan/40 rounded-2xl p-4 bg-cyber-cyan/5 flex flex-col sm:flex-row items-center gap-4">
          <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0 relative group">
            <img
              src={previewUrl || ''}
              alt="Complaint evidence preview"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 text-center sm:text-left min-w-0">
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <ImageIcon className="w-4 h-4 text-cyber-blue" />
              <p className="text-sm font-bold text-slate-800 truncate">
                {selectedFile?.name || 'Attached photo'}
              </p>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB` : ''} • Image attached
            </p>
          </div>

          <button
            type="button"
            onClick={handleRemove}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span>Remove</span>
          </button>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 ${
            dragActive
              ? 'border-cyber-cyan bg-cyan-50/50 scale-[1.01]'
              : 'border-slate-300 hover:border-cyber-cyan/60 bg-white hover:bg-slate-50/50'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyber-blue mx-auto mb-3 shadow-sm">
            <UploadCloud className="w-6 h-6 text-cyber-blue" />
          </div>
          <p className="text-sm font-bold text-slate-800">
            Click to upload complaint photo, or drag & drop
          </p>
          <p className="text-xs text-slate-500 mt-1">
            JPG, PNG, or WEBP (Max 5MB)
          </p>
        </div>
      )}

      {displayError && (
        <div className="flex items-center gap-1.5 text-xs text-rose-600 font-medium mt-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{displayError}</span>
        </div>
      )}
    </div>
  );
};
