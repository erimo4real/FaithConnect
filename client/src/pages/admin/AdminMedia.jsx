import { useState, useEffect } from 'react';
import { fetchMedia, deleteMedia, deleteMultipleMedia } from '../../services/api';
import AdminLayout from './AdminLayout';
import UploadModal from '../../components/admin/UploadModal';
import ConfirmModal from '../../components/admin/ConfirmModal';
import { useToast } from '../../context/ToastContext';
import { HiOutlineTrash, HiOutlineClipboardCopy, HiOutlineUpload, HiOutlineX } from 'react-icons/hi';
import { optimizeCloudinaryUrl } from '../../utils/cloudinary';

const IMG_EXTS = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
const VIDEO_EXTS = /\.(mp4|webm|mov|avi|mkv)$/i;
const AUDIO_EXTS = /\.(mp3|wav|ogg|aac|flac|m4a)$/i;

function getType(filename) {
  if (IMG_EXTS.test(filename)) return 'image';
  if (VIDEO_EXTS.test(filename)) return 'video';
  if (AUDIO_EXTS.test(filename)) return 'audio';
  return 'other';
}

export default function AdminMedia() {
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [previewItem, setPreviewItem] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [selected, setSelected] = useState(new Set());

  const toggleSelect = (publicId) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(publicId)) next.delete(publicId);
      else next.add(publicId);
      return next;
    });
  };

  const handleBulkDelete = async () => {
    if (selected.size === 0) return;
    if (!confirm(`Delete ${selected.size} files?`)) return;
    setBulkDeleting(true);
    const ids = Array.from(selected);
    try {
      await deleteMultipleMedia(ids);
      toast.success(`${ids.length} files deleted`);
      setItems(prev => prev.filter(i => !selected.has(i.public_id)));
      setSelected(new Set());
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBulkDeleting(false);
    }
  };

  const load = async () => {
    try { setItems(await fetchMedia()); }
    catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const handleUploaded = (result) => {
    if (result?.url) setItems(prev => [result, ...prev]);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try { await deleteMedia(deleteTarget.public_id); toast.success('File deleted'); setItems(prev => prev.filter(i => i.public_id !== deleteTarget.public_id)); setDeleteTarget(null); }
    catch (err) { toast.error(err.message); }
    finally { setDeleting(false); }
  };

  const copyUrl = (url) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied!');
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const renderPreview = (item) => {
    const type = getType(item.filename);
    switch (type) {
      case 'image':
        return <img src={optimizeCloudinaryUrl(item.url, { width: 400 })} alt={item.filename} className="w-full h-32 object-cover cursor-pointer" onClick={() => setPreviewItem(item)} />;
      case 'video':
        return (
          <video className="w-full h-32 object-cover" preload="metadata" muted>
            <source src={item.url} />
          </video>
        );
      case 'audio':
        return (
          <div className="w-full h-32 flex flex-col items-center justify-center bg-gradient-to-b from-gray-100 to-gray-200 text-gray-400 dark:text-gray-500">
            <svg className="w-10 h-10 mb-1" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55C7.79 13 6 14.79 6 17s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
            <span className="text-xs">{item.filename.split('.').pop().toUpperCase()}</span>
          </div>
        );
      default:
        return <div className="w-full h-32 flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">{item.filename.split('.').pop().toUpperCase()}</div>;
    }
  };

  return (
    <AdminLayout title="Media Library">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <p className="text-sm text-gray-500 dark:text-gray-400 shrink-0">{items.length} files</p>
            {selected.size > 0 && (
              <button onClick={handleBulkDelete} disabled={bulkDeleting} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50"><HiOutlineTrash className="w-4 h-4" /> {bulkDeleting ? 'Deleting...' : `Delete ${selected.size}`}</button>
            )}
          </div>
          <button onClick={() => setShowUpload(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"><HiOutlineUpload className="w-4 h-4" /> Upload</button>
        </div>
        <div className="p-6">
          {loading ? <p className="text-gray-400 dark:text-gray-500 text-center py-8">Loading...</p> : items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 dark:text-gray-500 mb-2">No files uploaded yet.</p>
              <button onClick={() => setShowUpload(true)} className="text-primary text-sm hover:underline">Upload your first file</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {items.map((item) => (
                <div key={item.public_id || item.filename} className={`group relative bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden border hover:shadow-sm transition-shadow ${selected.has(item.public_id) ? 'border-primary ring-2 ring-primary/30' : 'border-gray-100 dark:border-gray-700'}`}>
                  <div className="absolute top-2 left-2 z-10">
                    <input type="checkbox" checked={selected.has(item.public_id)} onChange={() => toggleSelect(item.public_id)} className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                  </div>
                  {renderPreview(item)}
                  <div className="p-2">
                    <p className="text-xs text-gray-600 dark:text-gray-300 truncate">{item.filename}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{formatSize(item.size)}</p>
                  </div>
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => copyUrl(item.url)} className="p-1.5 bg-white dark:bg-gray-700 rounded-lg shadow text-gray-600 dark:text-gray-300 hover:text-primary transition-colors"><HiOutlineClipboardCopy className="w-3.5 h-3.5" /></button>
                    <button onClick={() => setDeleteTarget(item)} className="p-1.5 bg-white dark:bg-gray-700 rounded-lg shadow text-red-600 hover:bg-red-50 transition-colors"><HiOutlineTrash className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <UploadModal open={showUpload} onClose={() => setShowUpload(false)} onUploaded={handleUploaded} />
      <ConfirmModal open={!!deleteTarget} title="Delete file?" message="This cannot be undone." confirmLabel={deleting ? 'Deleting...' : 'Delete'} confirmDisabled={deleting} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={() => setPreviewItem(null)}>
          <div className="relative max-w-4xl max-h-[90vh] mx-4" onClick={e => e.stopPropagation()}>
            <button onClick={() => setPreviewItem(null)} className="absolute -top-3 -right-3 w-8 h-8 bg-white dark:bg-gray-800 rounded-full shadow flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 z-10"><HiOutlineX className="w-5 h-5" /></button>
            {getType(previewItem.filename) === 'image' ? (
              <img src={optimizeCloudinaryUrl(previewItem.url, { width: 1200 })} alt={previewItem.filename} className="max-w-full max-h-[90vh] rounded-xl shadow-2xl" />
            ) : getType(previewItem.filename) === 'video' ? (
              <video controls className="max-w-full max-h-[90vh] rounded-xl shadow-2xl" src={previewItem.url} />
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 text-center">
                <p className="text-gray-800 dark:text-gray-100 font-medium">{previewItem.filename}</p>
                <a href={previewItem.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm mt-2 inline-block">Download</a>
              </div>
            )}
            <p className="text-white text-sm text-center mt-3 truncate">{previewItem.filename}</p>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
