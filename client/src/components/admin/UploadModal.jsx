import { useState, useRef } from 'react';
import { uploadFile, uploadMultipleFiles } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { HiOutlineX } from 'react-icons/hi';

export default function UploadModal({ open, onClose, onUploaded }) {
  const toast = useToast();
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState([]);
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);

  const ALLOWED = '.jpg,.jpeg,.png,.gif,.webp,.mp4,.webm,.mov,.avi,.mkv,.mp3,.wav,.ogg,.aac,.flac,.m4a,.pdf,.doc,.docx';

  const handleSelect = (e) => {
    const selected = Array.from(e.target.files || []);
    setFiles(selected);
    setResults([]);
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setUploading(true);
    try {
      if (files.length === 1) {
        const result = await uploadFile(files[0]);
        toast.success('File uploaded');
        onUploaded?.(result);
        onClose();
      } else {
        const uploaded = await uploadMultipleFiles(files);
        toast.success(`${uploaded.length} files uploaded`);
        uploaded.forEach(r => onUploaded?.(r));
        onClose();
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
      setFiles([]);
    }
  };

  const removeFile = (i) => {
    setFiles(prev => prev.filter((_, idx) => idx !== i));
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Upload Files</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Images, video, audio, PDF — max 200MB per file
        </p>

        <input
          ref={inputRef}
          type="file"
          multiple
          onChange={handleSelect}
          accept={ALLOWED}
          className="w-full text-sm text-gray-600 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-white file:text-sm file:font-medium hover:file:bg-primary/90"
        />

        {files.length > 0 && (
          <ul className="mt-3 space-y-1 max-h-40 overflow-y-auto">
            {files.map((f, i) => (
              <li key={i} className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-900 rounded-lg px-3 py-1.5">
                <span className="truncate mr-2">{f.name}</span>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-gray-400 dark:text-gray-500">{formatSize(f.size)}</span>
                  {!uploading && (
                    <button onClick={() => removeFile(i)} className="text-red-500 hover:text-red-700"><HiOutlineX className="w-4 h-4" /></button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="flex gap-3 justify-end mt-4">
          <button onClick={onClose} disabled={uploading} className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50">Cancel</button>
          {files.length > 0 && (
            <button onClick={handleUpload} disabled={uploading} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
              {uploading ? 'Uploading...' : `Upload ${files.length === 1 ? 'file' : `${files.length} files`}`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
