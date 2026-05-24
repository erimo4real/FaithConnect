import { useState, useEffect } from 'react';
import { adminFetchEvents, adminCreateEvent, adminUpdateEvent, adminDeleteEvent } from '../../services/api';
import AdminLayout from './AdminLayout';
import { useToast } from '../../context/ToastContext';
import { HiOutlinePencil, HiOutlineTrash, HiOutlinePlus, HiOutlinePhotograph } from 'react-icons/hi';
import MediaPicker from '../../components/admin/MediaPicker';

export default function AdminEvents() {
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ title: '', date: '', time: '', days: '', location: '', description: '', image: '', spots: null, status: 'published' });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [search, setSearch] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filtered = items.filter(item => { if (!search) return true; const q = search.toLowerCase(); return Object.values(item).some(v => String(v).toLowerCase().includes(q)); });
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  const load = async () => { try { setItems(await adminFetchEvents()); } catch (err) { toast.error(err.message); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);
  const resetForm = () => { setForm({ title: '', date: '', time: '', days: '', location: '', description: '', image: '', spots: null, status: 'published' }); setEditId(null); setShowForm(false); };
  const handleEdit = (item) => { setForm({ ...item, date: item.date?.slice(0, 10) || '', time: item.time || '', days: item.days || '' }); setEditId(item.id); setShowForm(true); };
  const handleSubmit = async (e) => { e.preventDefault(); setSaving(true); const payload = { ...form, date: form.date || null, time: form.time || null, days: form.days || null }; try { if (editId) { await adminUpdateEvent(editId, payload); toast.success('Event updated'); } else { await adminCreateEvent(payload); toast.success('Event created'); } resetForm(); load(); } catch (err) { toast.error(err.message); } finally { setSaving(false); } };
  const handleDelete = async (id) => { if (!confirm('Delete this event?')) return; setDeleting(id); try { await adminDeleteEvent(id); toast.success('Event deleted'); load(); } catch (err) { toast.error(err.message); } finally { setDeleting(null); } };

  return (
    <AdminLayout title="Events">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 shrink-0">{items.length} events</p>
          <div className="flex items-center gap-3">
            <input placeholder="Search..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="px-3 py-1.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm dark:bg-gray-800 dark:text-gray-200 w-48" />
            <button onClick={() => { resetForm(); setShowForm(!showForm); }} className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-xl hover:bg-accent transition-colors text-sm font-medium">
            <HiOutlinePlus className="w-4 h-4" /> {showForm ? 'Cancel' : 'Add Event'}
          </button>
          </div>
        </div>

        {showForm && (
          <div className="p-6 border-b border-gray-100 bg-gray-50/50 dark:bg-gray-900/50">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm dark:bg-gray-800 dark:text-gray-200" required />
                <input placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm dark:bg-gray-800 dark:text-gray-200" required />
                <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm dark:bg-gray-800 dark:text-gray-200" />
                <input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm dark:bg-gray-800 dark:text-gray-200" />
                <input placeholder="Days (e.g. Every Sunday)" value={form.days ?? ''} onChange={(e) => setForm({ ...form, days: e.target.value })} className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm dark:bg-gray-800 dark:text-gray-200" />
                <div className="flex gap-2">
                  <input placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm dark:bg-gray-800 dark:text-gray-200" />
                  <button type="button" onClick={() => setPickerOpen(true)} className="px-3 py-2 bg-gray-100 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 text-sm transition-colors shrink-0" title="Browse Media"><HiOutlinePhotograph className="w-5 h-5" /></button>
                </div>
                <input type="number" placeholder="Spots (optional)" value={form.spots ?? ''} onChange={(e) => setForm({ ...form, spots: e.target.value === '' ? null : Number(e.target.value) })} className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm dark:bg-gray-800 dark:text-gray-200" />
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm dark:bg-gray-800 dark:text-gray-200">
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm dark:bg-gray-800 dark:text-gray-200" rows="3" />
              <button type="submit" disabled={saving} className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 text-sm font-medium transition-colors disabled:opacity-50">{saving ? 'Saving...' : (editId ? 'Update' : 'Create')}</button>
            </form>
          </div>
        )}

        <div className="p-6">
          {loading ? <p className="text-gray-400 dark:text-gray-500 text-center py-8">Loading...</p> : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                      <th className="pb-3 pr-4">Title</th>
                      <th className="pb-3 pr-4">Date</th>
                      <th className="pb-3 pr-4">Days</th>
                      <th className="pb-3 pr-4">Location</th>
                      <th className="pb-3 pr-4">Status</th>
                      <th className="pb-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paged.map((item) => (
                      <tr key={item.id} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <td className="py-3 pr-4 text-sm font-medium text-gray-800 dark:text-gray-100">{item.title}</td>
                        <td className="py-3 pr-4 text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">{item.date?.slice(0, 10) || item.days || '-'}</td>
                        <td className="py-3 pr-4 text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">{item.days || '-'}</td>
                        <td className="py-3 pr-4 text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">{item.location}</td>
                        <td className="py-3 pr-4"><span className={`text-xs px-2 py-1 rounded-lg font-medium ${item.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{item.status || 'published'}</span></td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <button onClick={() => handleEdit(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><HiOutlinePencil className="w-4 h-4" /></button>
                            <button onClick={() => handleDelete(item.id)} disabled={deleting === item.id} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"><HiOutlineTrash className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && <tr><td colSpan="6" className="py-8 text-center text-gray-400 dark:text-gray-500 text-sm">{items.length === 0 ? 'No events yet' : 'No matching results'}</td></tr>}
                  </tbody>
                </table>
              </div>
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700 mt-4">
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
      </div>
      <MediaPicker open={pickerOpen} onSelect={(url) => { setForm(f => ({ ...f, image: url })); setPickerOpen(false); }} onClose={() => setPickerOpen(false)} />
    </AdminLayout>
  );
}
