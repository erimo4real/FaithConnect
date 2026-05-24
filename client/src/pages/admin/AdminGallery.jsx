import { useState, useEffect } from 'react';
import { adminFetchGalleryItems, adminCreateGalleryItem, adminUpdateGalleryItem, adminDeleteGalleryItem } from '../../services/api';
import AdminLayout from './AdminLayout';
import { useToast } from '../../context/ToastContext';
import { HiOutlinePencil, HiOutlineTrash, HiOutlinePlus, HiOutlinePhotograph, HiOutlineX } from 'react-icons/hi';
import { optimizeCloudinaryUrl } from '../../utils/cloudinary';
import MediaPicker from '../../components/admin/MediaPicker';

export default function AdminGallery() {
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', src: '', category: 'worship', type: 'image', thumbnail: '' });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pickerFor, setPickerFor] = useState(null);
  const [previewItem, setPreviewItem] = useState(null);
  const pageSize = 10;

  const defaultCategories = ['worship', 'outreach', 'young adults', 'events'];
  const allCategories = [...new Set([...defaultCategories, ...items.map(i => i.category).filter(Boolean)])];
  const filtered = items.filter(item => {
    if (search) { const q = search.toLowerCase(); if (!Object.values(item).some(v => String(v).toLowerCase().includes(q))) return false; }
    if (categoryFilter && item.category !== categoryFilter) return false;
    return true;
  });
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  const load = async () => { try { setItems(await adminFetchGalleryItems()); } catch (err) { toast.error(err.message); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);
  const resetForm = () => { setForm({ title: '', description: '', src: '', category: 'worship', type: 'image', thumbnail: '' }); setEditId(null); setShowForm(false); };
  const handleEdit = (item) => { setForm(item); setEditId(item.id); setShowForm(true); };
  const handleSubmit = async (e) => { e.preventDefault(); setSaving(true); try { if (editId) { await adminUpdateGalleryItem(editId, form); toast.success('Gallery item updated'); } else { await adminCreateGalleryItem(form); toast.success('Gallery item created'); } resetForm(); load(); } catch (err) { toast.error(err.message); } finally { setSaving(false); } };
  const handleDelete = async (id) => { if (!confirm('Delete this item?')) return; setDeleting(id); try { await adminDeleteGalleryItem(id); toast.success('Gallery item deleted'); load(); } catch (err) { toast.error(err.message); } finally { setDeleting(null); } };

  return (
    <AdminLayout title="Gallery">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 shrink-0">{items.length} items</p>
          <div className="flex items-center gap-2">
            <select value={categoryFilter} onChange={e => { setCategoryFilter(e.target.value); setPage(1); }} className="px-3 py-1.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary">
              <option value="">All Categories</option>
              {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input placeholder="Search..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="px-3 py-1.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm dark:bg-gray-800 dark:text-gray-200 w-40" />
            <button onClick={() => { resetForm(); setShowForm(!showForm); }} className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-xl hover:bg-accent transition-colors text-sm font-medium">
            <HiOutlinePlus className="w-4 h-4" /> {showForm ? 'Cancel' : 'Add Item'}
          </button>
          </div>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50/50 dark:bg-gray-900/50 rounded-xl space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm dark:bg-gray-800 dark:text-gray-200" required />
              <div className="flex gap-2">
                <input placeholder="Image URL" value={form.src} onChange={(e) => setForm({ ...form, src: e.target.value })} className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm dark:bg-gray-800 dark:text-gray-200" required />
                <button type="button" onClick={() => setPickerFor('src')} className="px-3 py-2 bg-gray-100 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 text-sm transition-colors shrink-0" title="Browse Media"><HiOutlinePhotograph className="w-5 h-5" /></button>
              </div>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm dark:bg-gray-800 dark:text-gray-200">
                {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm dark:bg-gray-800 dark:text-gray-200">
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
              <div className="flex gap-2">
                <input placeholder="Thumbnail URL (for videos)" value={form.thumbnail} onChange={(e) => setForm({ ...form, thumbnail: e.target.value })} className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm dark:bg-gray-800 dark:text-gray-200" />
                <button type="button" onClick={() => setPickerFor('thumbnail')} className="px-3 py-2 bg-gray-100 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 text-sm transition-colors shrink-0" title="Browse Media"><HiOutlinePhotograph className="w-5 h-5" /></button>
              </div>
            </div>
            <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm dark:bg-gray-800 dark:text-gray-200" rows="2" />
            <button type="submit" disabled={saving} className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 text-sm font-medium transition-colors disabled:opacity-50">{saving ? 'Saving...' : (editId ? 'Update' : 'Create')}</button>
          </form>
        )}

          {loading ? <p className="text-gray-400 dark:text-gray-500 text-center py-8">Loading...</p> : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {paged.map((item) => (
                <div key={item.id} className="group relative rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-sm">
                  <img src={optimizeCloudinaryUrl(item.src, { width: 400 })} alt={item.title} className="w-full h-32 object-cover cursor-pointer" onClick={() => setPreviewItem(item)} />
                  <div className="p-2">
                    <p className="text-sm font-medium truncate">{item.title}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{item.category}</p>
                  </div>
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEdit(item)} className="bg-white dark:bg-gray-700 p-1.5 rounded-lg shadow text-blue-600 hover:bg-blue-50"><HiOutlinePencil className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleDelete(item.id)} disabled={deleting === item.id} className="bg-white dark:bg-gray-700 p-1.5 rounded-lg shadow text-red-600 hover:bg-red-50 disabled:opacity-40"><HiOutlineTrash className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && <p className="col-span-full text-center text-gray-400 dark:text-gray-500 py-8 text-sm">{items.length === 0 ? 'No gallery items yet' : 'No matching results'}</p>}
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700 mt-6">
                <p className="text-sm text-gray-400 dark:text-gray-500">Page {page} of {totalPages}</p>
                <div className="flex gap-2">
                  <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Previous</button>
                  <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Next</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <MediaPicker open={pickerFor !== null} onSelect={(url) => { if (pickerFor) setForm(f => ({ ...f, [pickerFor]: url })); setPickerFor(null); }} onClose={() => setPickerFor(null)} />
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={() => setPreviewItem(null)}>
          <div className="relative max-w-4xl max-h-[90vh] mx-4" onClick={e => e.stopPropagation()}>
            <button onClick={() => setPreviewItem(null)} className="absolute -top-3 -right-3 w-8 h-8 bg-white dark:bg-gray-800 rounded-full shadow flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 z-10"><HiOutlineX className="w-5 h-5" /></button>
            {previewItem.type === 'video' ? (
              <video controls className="max-w-full max-h-[90vh] rounded-xl shadow-2xl" src={previewItem.src} poster={optimizeCloudinaryUrl(previewItem.thumbnail, { width: 1200 })} />
            ) : (
              <img src={optimizeCloudinaryUrl(previewItem.src, { width: 1200 })} alt={previewItem.title} className="max-w-full max-h-[90vh] rounded-xl shadow-2xl" />
            )}
            <p className="text-white text-sm text-center mt-3">{previewItem.title}</p>
            {previewItem.description && <p className="text-gray-300 text-xs text-center mt-1">{previewItem.description}</p>}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
