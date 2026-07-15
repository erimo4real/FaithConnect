import { useState, useEffect } from 'react';
import { adminFetchContactMessages, adminUpdateContactMessage, adminDeleteContactMessage } from '../../services/api';
import AdminLayout from './AdminLayout';
import { useToast } from '../../context/ToastContext';
import { HiOutlineTrash, HiOutlineEye } from 'react-icons/hi';

export default function AdminContact() {
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [updating, setUpdating] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const pageSize = 10;

  const filtered = items.filter(item => { if (!search) return true; const q = search.toLowerCase(); return Object.values(item).some(v => String(v).toLowerCase().includes(q)); });
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  const load = async () => { try { setItems(await adminFetchContactMessages()); } catch (err) { toast.error(err.message); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);

  const handleStatus = async (id, status) => { setUpdating(id); try { await adminUpdateContactMessage(id, { status }); toast.success('Status updated'); load(); } catch (err) { toast.error(err.message); } finally { setUpdating(null); } };
  const handleDelete = async (id) => { if (!confirm('Delete this message?')) return; setDeleting(id); try { await adminDeleteContactMessage(id); toast.success('Message deleted'); load(); } catch (err) { toast.error(err.message); } finally { setDeleting(null); } };

  return (
    <AdminLayout title="Contact Messages">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 ${selected ? '' : 'lg:col-span-3'}`}>
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 shrink-0">{items.length} messages</p>
          <input placeholder="Search..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="px-3 py-1.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm dark:bg-gray-800 dark:text-gray-200 w-48" />
        </div>
        <div className="p-6">
          {loading ? <p className="text-gray-400 dark:text-gray-500 text-center py-8">Loading...</p> : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                      <th className="pb-3 pr-4">Name</th>
                      <th className="pb-3 pr-4">Subject</th>
                      <th className="pb-3 pr-4">Status</th>
                      <th className="pb-3 pr-4">Date</th>
                      <th className="pb-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paged.map((item) => (
                      <tr key={item.id} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <td className="py-3 pr-4 text-sm font-medium text-gray-800 dark:text-gray-100">{item.name}</td>
                        <td className="py-3 pr-4 text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">{item.subject}</td>
                        <td className="py-3 pr-4">
                          <span className={`text-xs px-2 py-1 rounded-lg font-medium ${item.status === 'read' ? 'bg-blue-100 text-blue-700' : item.status === 'replied' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {item.status || 'unread'}
                          </span>
                        </td>
                        <td className="py-3 pr-4 text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">{new Date(item.created_at).toLocaleDateString()}</td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <button onClick={() => setSelected(item)} className="p-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"><HiOutlineEye className="w-4 h-4" /></button>
                            <select value={item.status || 'unread'} onChange={(e) => handleStatus(item.id, e.target.value)} disabled={updating === item.id} className="border border-gray-200 dark:border-gray-600 rounded-lg text-xs p-1.5 outline-none focus:ring-2 focus:ring-primary disabled:opacity-40">
                              <option value="unread">Unread</option>
                              <option value="read">Read</option>
                              <option value="replied">Replied</option>
                            </select>
                            <button onClick={() => handleDelete(item.id)} disabled={deleting === item.id} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"><HiOutlineTrash className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && <tr><td colSpan="5" className="py-8 text-center text-gray-400 dark:text-gray-500 text-sm">{items.length === 0 ? 'No messages yet' : 'No matching results'}</td></tr>}
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

        {selected && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 h-fit">
            <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100 mb-1">{selected.name}</h3>
            <p className="text-sm text-gray-400 dark:text-gray-500 mb-1">{selected.email}{selected.phone ? ` | ${selected.phone}` : ''}</p>
            <p className="text-sm font-semibold text-primary mb-4">{selected.subject}</p>
            <div>
              <p className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 mb-1">Message</p>
              <p className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap">{selected.message}</p>
            </div>
            <button onClick={() => setSelected(null)} className="mt-4 text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:text-gray-200 transition-colors">Close</button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
