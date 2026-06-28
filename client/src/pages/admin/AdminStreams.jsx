import { useState, useEffect } from 'react';
import { adminFetchStreams, adminCreateStream, adminUpdateStream, adminDeleteStream, fetchCurrentStream } from '../../services/api';
import AdminLayout from './AdminLayout';
import { useToast } from '../../context/ToastContext';
import { HiOutlinePencil, HiOutlineTrash, HiOutlinePlus } from 'react-icons/hi';

export default function AdminStreams() {
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [current, setCurrent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ title: '', youtube_url: '', scheduled_date: '', scheduled_time: '', end_time: '', recurring: '', is_live: false });
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [page, setPage] = useState(1);
  const [extendModal, setExtendModal] = useState(null);
  const [extendMinutes, setExtendMinutes] = useState(30);
  const [dismissedEndId, setDismissedEndId] = useState(null);
  const pageSize = 10;

  const filtered = items.filter(item => { if (!search) return true; const q = search.toLowerCase(); return Object.values(item).some(v => String(v).toLowerCase().includes(q)); });
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  const load = async () => { try { setItems(await adminFetchStreams()); } catch (err) { toast.error(err.message); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);
  const resetForm = () => { setForm({ title: '', youtube_url: '', scheduled_date: '', scheduled_time: '', end_time: '', recurring: '', is_live: false }); setEditId(null); setShowForm(false); };
  const handleEdit = (item) => { setForm(item); setEditId(item.id); setShowForm(true); };
  const handleSubmit = async (e) => { e.preventDefault(); setSaving(true); try { if (editId) { await adminUpdateStream(editId, form); toast.success('Stream updated'); } else { await adminCreateStream(form); toast.success('Stream created'); } resetForm(); load(); } catch (err) { toast.error(err.message); } finally { setSaving(false); } };
  const handleDelete = async (id) => { if (!confirm('Delete this stream?')) return; setDeleting(id); try { await adminDeleteStream(id); toast.success('Stream deleted'); load(); } catch (err) { toast.error(err.message); } finally { setDeleting(null); } };

  useEffect(() => {
    if (!current || !current.is_live || !current.end_time) { setExtendModal(null); return; }
    if (dismissedEndId === current.id) return;

    const check = () => {
      const endTime = current.end_time.length === 5 ? current.end_time + ':00' : current.end_time;
      const endDate = new Date(`${current.scheduled_date}T${endTime}+01:00`);
      const diffMs = endDate.getTime() - Date.now();
      if (diffMs <= 0) { setExtendModal({ expired: true, minsLeft: 0 }); return; }
      const minsLeft = Math.floor(diffMs / 60000);
      if (minsLeft <= 20) {
        setExtendModal(last => last?.showPicker ? last : { minsLeft, showPicker: false });
      } else {
        setExtendModal(last => last && !last.showPicker ? null : last);
      }
    };

    check();
    const interval = setInterval(check, 15000);
    return () => clearInterval(interval);
  }, [current, dismissedEndId]);

  const handleExtend = async () => {
    if (!current) return;
    try {
      const [h, m] = current.end_time.split(':').map(Number);
      const total = h * 60 + m + extendMinutes;
      const newH = Math.floor(total / 60) % 24;
      const newM = total % 60;
      const newEnd = `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
      await adminUpdateStream(current.id, {
        title: current.title,
        youtube_url: current.youtube_url,
        scheduled_date: current.scheduled_date,
        scheduled_time: current.scheduled_time,
        end_time: newEnd,
        recurring: current.recurring,
        is_live: true,
      });
      toast.success(`Extended to ${newEnd}`);
      setExtendModal(null);
      setDismissedEndId(null);
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDismissExtend = () => {
    if (current) setDismissedEndId(current.id);
    setExtendModal(null);
  };

  return (
    <AdminLayout title="Live Streams">
      {current && (
        <div className={`mb-6 p-4 rounded-xl border ${current.is_live ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600'}`}>
          <div className="flex items-center gap-3">
            <span className={`w-3 h-3 rounded-full ${current.is_live ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></span>
            <span className="font-semibold text-sm">{current.is_live ? 'Currently Live' : 'Currently Offline'}</span>
            {current.title && <span className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">— {current.title}</span>}
          </div>
        </div>
      )}

      {extendModal && (
        <div className="mb-6 p-4 rounded-xl border border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20">
          {!extendModal.showPicker ? (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="font-semibold text-sm text-yellow-800 dark:text-yellow-200">
                  {extendModal.expired ? 'Stream should have ended' : 'Live stream ending soon'}
                </p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  {extendModal.expired
                    ? 'The end time has passed. Do you want to extend or end the stream?'
                    : `The stream ends in ${extendModal.minsLeft} minute${extendModal.minsLeft !== 1 ? 's' : ''}. Extend the time or let it end?`}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={handleDismissExtend} className="px-4 py-2 text-sm font-medium rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors min-h-[44px]">Let it end</button>
                <button onClick={() => setExtendModal({ ...extendModal, showPicker: true })} className="px-4 py-2 text-sm font-medium rounded-xl bg-primary text-white hover:bg-accent transition-colors min-h-[44px]">Extend</button>
              </div>
            </div>
          ) : (
            <div>
              <p className="font-semibold text-sm text-yellow-800 dark:text-yellow-200 mb-3">Extend stream by:</p>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {[10, 20, 30, 60, 90].map(n => (
                  <button key={n} onClick={() => setExtendMinutes(n)}
                    className={`px-4 py-2 text-sm font-medium rounded-xl border transition-colors min-h-[44px] ${extendMinutes === n ? 'bg-primary text-white border-primary' : 'border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                    {n} min
                  </button>
                ))}
                <input type="number" value={extendMinutes} onChange={e => setExtendMinutes(Math.max(1, parseInt(e.target.value) || 0))}
                  className="w-20 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl text-sm dark:bg-gray-800 dark:text-gray-200" min="1" />
                <span className="text-sm text-gray-500 dark:text-gray-400">min</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setExtendModal({ ...extendModal, showPicker: false })} className="px-4 py-2 text-sm font-medium rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors min-h-[44px]">Back</button>
                <button onClick={handleExtend} className="px-4 py-2 text-sm font-medium rounded-xl bg-green-600 text-white hover:bg-green-700 transition-colors min-h-[44px]">Apply extension</button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="px-4 lg:px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 shrink-0">{items.length} streams</p>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input placeholder="Search..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="min-w-0 flex-1 sm:w-48 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm dark:bg-gray-800 dark:text-gray-200" />
            <button onClick={() => { resetForm(); setShowForm(!showForm); }} className="shrink-0 flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-primary text-white rounded-xl hover:bg-accent transition-colors text-sm font-medium min-h-[44px]">
            <HiOutlinePlus className="w-4 h-4" /> <span className="hidden sm:inline">{showForm ? 'Cancel' : 'Add Stream'}</span>
          </button>
          </div>
        </div>

        {showForm && (
          <div className="p-4 lg:p-6 border-b border-gray-100 bg-gray-50/50 dark:bg-gray-900/50">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm dark:bg-gray-800 dark:text-gray-200" required />
                <input placeholder="Facebook or YouTube URL" value={form.youtube_url} onChange={(e) => setForm({ ...form, youtube_url: e.target.value })} className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm dark:bg-gray-800 dark:text-gray-200" required />
                <input type="date" value={form.scheduled_date} onChange={(e) => setForm({ ...form, scheduled_date: e.target.value })} className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm dark:bg-gray-800 dark:text-gray-200" required />
                <input type="time" value={form.scheduled_time} onChange={(e) => setForm({ ...form, scheduled_time: e.target.value })} className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm dark:bg-gray-800 dark:text-gray-200" required />
                <input type="time" value={form.end_time} onChange={(e) => setForm({ ...form, end_time: e.target.value })} placeholder="End time" className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm dark:bg-gray-800 dark:text-gray-200" required />
                <select value={form.recurring} onChange={(e) => setForm({ ...form, recurring: e.target.value })} className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm dark:bg-gray-800 dark:text-gray-200">
                  <option value="">Never (one-time)</option>
                  <option value="weekly">Weekly</option>
                </select>
                <label className="flex items-center gap-2 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl text-sm">
                  <input type="checkbox" checked={form.is_live} onChange={(e) => setForm({ ...form, is_live: e.target.checked })} className="w-4 h-4 text-primary" />
                  <span>Live now</span>
                </label>
              </div>
              <button type="submit" disabled={saving} className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 text-sm font-medium transition-colors disabled:opacity-50 min-h-[44px]">{saving ? 'Saving...' : editId ? 'Update' : 'Create'}</button>
            </form>
          </div>
        )}

        <div className="p-4 lg:p-6">
          {loading ? <p className="text-gray-400 dark:text-gray-500 text-center py-8">Loading...</p> : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                      <th className="pb-3 pr-2 lg:pr-4">Title</th>
                      <th className="pb-3 pr-2 lg:pr-4">Status</th>
                      <th className="pb-3 pr-2 lg:pr-4">Date</th>
                      <th className="pb-3 pr-2 lg:pr-4">Start</th>
                      <th className="pb-3 pr-2 lg:pr-4">End</th>
                      <th className="pb-3 pr-2 lg:pr-4">Repeats</th>
                      <th className="pb-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paged.map((item) => (
                      <tr key={item.id} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <td className="py-3 pr-2 lg:pr-4 text-sm font-medium text-gray-800 dark:text-gray-100">{item.title}</td>
                        <td className="py-3 pr-2 lg:pr-4">
                          <span className={`text-xs px-2 py-1 rounded-lg font-medium ${item.is_live ? 'bg-green-100 dark:bg-green-900/30 text-green-700' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
                            {item.is_live ? 'LIVE' : 'Offline'}
                          </span>
                        </td>
                        <td className="py-3 pr-2 lg:pr-4 text-sm text-gray-500 dark:text-gray-400">{item.scheduled_date || '-'}</td>
                        <td className="py-3 pr-2 lg:pr-4 text-sm text-gray-500 dark:text-gray-400">{item.scheduled_time?.slice(0, 5) || '-'}</td>
                        <td className="py-3 pr-2 lg:pr-4 text-sm text-gray-500 dark:text-gray-400">{item.end_time?.slice(0, 5) || '-'}</td>
                        <td className="py-3 pr-2 lg:pr-4 text-sm text-gray-500 dark:text-gray-400">{item.recurring === 'weekly' ? 'Weekly' : 'Once'}</td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <button onClick={() => handleEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><HiOutlinePencil className="w-4 h-4" /></button>
                            <button onClick={() => handleDelete(item.id)} disabled={deleting === item.id} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"><HiOutlineTrash className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && <tr><td colSpan="7" className="py-8 text-center text-gray-400 dark:text-gray-500 text-sm">{items.length === 0 ? 'No streams yet' : 'No matching results'}</td></tr>}
                  </tbody>
                </table>
              </div>
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-gray-100 dark:border-gray-700 mt-4">
                  <p className="text-sm text-gray-400 dark:text-gray-500">Page {page} of {totalPages}</p>
                  <div className="flex gap-2">
                    <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl text-sm disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors min-h-[44px]">Previous</button>
                    <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl text-sm disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors min-h-[44px]">Next</button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
