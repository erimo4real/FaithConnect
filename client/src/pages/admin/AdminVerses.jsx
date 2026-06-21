import { useState, useEffect } from 'react';
import { adminFetchVerses, adminCreateVerse, adminUpdateVerse, adminDeleteVerse } from '../../services/api';
import AdminLayout from './AdminLayout';
import { useToast } from '../../context/ToastContext';
import { HiOutlinePencil, HiOutlineTrash, HiOutlinePlus } from 'react-icons/hi';

export default function AdminVerses() {
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ verse_text: '', reference: '', version: 'NIV', scheduled_date: '', is_published: false });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filtered = items.filter(item => { if (!search) return true; const q = search.toLowerCase(); return Object.values(item).some(v => String(v).toLowerCase().includes(q)); });
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  const load = async () => { try { setItems(await adminFetchVerses()); } catch (err) { toast.error(err.message); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);

  const resetForm = () => { setForm({ verse_text: '', reference: '', version: 'NIV', scheduled_date: '', is_published: false }); setEditId(null); setShowForm(false); };
  const handleEdit = (item) => { setForm({ verse_text: item.verse_text || '', reference: item.reference || '', version: item.version || 'NIV', scheduled_date: item.scheduled_date?.slice(0, 10) || '', is_published: item.is_published || false }); setEditId(item.id); setShowForm(true); };
  const handleSubmit = async (e) => { e.preventDefault(); setSaving(true); const payload = { ...form, scheduled_date: form.scheduled_date || null }; try { if (editId) { await adminUpdateVerse(editId, payload); toast.success('Verse updated'); } else { await adminCreateVerse(payload); toast.success('Verse created'); } resetForm(); load(); } catch (err) { toast.error(err.message); } finally { setSaving(false); } };
  const handleDelete = async (id) => { if (!confirm('Delete this verse?')) return; setDeleting(id); try { await adminDeleteVerse(id); toast.success('Verse deleted'); load(); } catch (err) { toast.error(err.message); } finally { setDeleting(null); } };

  return (
    <AdminLayout title="Bible Verses">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 shrink-0">{items.length} verses</p>
          <div className="flex items-center gap-3">
            <input placeholder="Search..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="px-3 py-1.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm dark:bg-gray-800 dark:text-gray-200 w-48" />
            <button onClick={() => { resetForm(); setShowForm(!showForm); }} className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-xl hover:bg-accent transition-colors text-sm font-medium">
            <HiOutlinePlus className="w-4 h-4" /> {showForm ? 'Cancel' : 'Add Verse'}
            </button>
          </div>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="p-6 border-b border-gray-100 dark:border-gray-700 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Verse Text *</label>
                <textarea value={form.verse_text} onChange={e => setForm({ ...form, verse_text: e.target.value })} required rows={3} className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm dark:bg-gray-800 dark:text-gray-200" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reference *</label>
                <input value={form.reference} onChange={e => setForm({ ...form, reference: e.target.value })} required className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm dark:bg-gray-800 dark:text-gray-200" placeholder="John 3:16" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Version</label>
                <input value={form.version} onChange={e => setForm({ ...form, version: e.target.value })} className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm dark:bg-gray-800 dark:text-gray-200" placeholder="NIV" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Scheduled Date</label>
                <input type="date" value={form.scheduled_date} onChange={e => setForm({ ...form, scheduled_date: e.target.value })} className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm dark:bg-gray-800 dark:text-gray-200" />
                <p className="text-xs text-gray-400 mt-1">Leave blank for auto-schedule (Tue/Thu)</p>
              </div>
              <div className="flex items-end pb-2">
                <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <input type="checkbox" checked={form.is_published} onChange={e => setForm({ ...form, is_published: e.target.checked })} className="rounded border-gray-300 dark:border-gray-600" />
                  Published
                </label>
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="px-6 py-2 bg-primary text-white rounded-xl hover:bg-accent transition-colors text-sm font-medium disabled:opacity-50">
                {saving ? 'Saving...' : editId ? 'Update' : 'Create'}
              </button>
              <button type="button" onClick={resetForm} className="px-6 py-2 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Reference</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Verse</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Version</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Scheduled</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Status</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {loading ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Loading...</td></tr>
              ) : paged.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No verses found.</td></tr>
              ) : paged.map(item => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200">{item.reference}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400 max-w-xs truncate">{item.verse_text}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{item.version}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{item.scheduled_date ? new Date(item.scheduled_date).toLocaleDateString() : <span className="text-gray-400 italic text-xs">Auto (Tue/Thu)</span>}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.is_published ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                      {item.is_published ? 'Published' : 'Scheduled'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleEdit(item)} className="p-2 text-gray-400 hover:text-primary transition-colors" title="Edit"><HiOutlinePencil className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(item.id)} disabled={deleting === item.id} className="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Delete"><HiOutlineTrash className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700">Prev</button>
              <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700">Next</button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
