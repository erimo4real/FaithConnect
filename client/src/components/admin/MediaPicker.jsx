import { useState, useEffect } from 'react';
import { fetchMedia } from '../../services/api';
import { optimizeCloudinaryUrl } from '../../utils/cloudinary';
import { HiOutlineX } from 'react-icons/hi';

export default function MediaPicker({ open, onSelect, onClose }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetchMedia().then(setItems).catch(() => {}).finally(() => setLoading(false));
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-3xl mx-4 max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Select Media</h3>
          <button onClick={onClose} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"><HiOutlineX className="w-6 h-6" /></button>
        </div>
        <div className="flex-1 overflow-y-auto min-h-0">
          {loading ? (
            <p className="text-gray-400 dark:text-gray-500 text-center py-8">Loading...</p>
          ) : items.length === 0 ? (
            <p className="text-gray-400 dark:text-gray-500 text-center py-8">No media uploaded yet.</p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {items.map(item => (
                <button
                  key={item.public_id}
                  type="button"
                  onClick={() => onSelect(item.url)}
                  className="group relative rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition-all text-left"
                >
                  {item.url.match(/\.(mp4|webm|mov|avi|mkv)$/i) ? (
                    <video src={item.url} className="w-full h-24 object-cover" preload="metadata" muted />
                  ) : (
                    <img src={optimizeCloudinaryUrl(item.url, { width: 200 })} alt="" className="w-full h-24 object-cover" />
                  )}
                  <div className="p-1.5">
                    <p className="text-xs text-gray-600 dark:text-gray-300 truncate">{item.filename}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
