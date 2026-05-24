import { useState, useEffect } from 'react';
import { adminFetchSubscribers, adminDeleteSubscriber } from '../../services/api';
import AdminLayout from './AdminLayout';
import { useToast } from '../../context/ToastContext';
import { HiOutlineTrash, HiOutlineDownload } from 'react-icons/hi';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export default function AdminSubscribers() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const [deleting, setDeleting] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filtered = items.filter(item => { if (!search) return true; const q = search.toLowerCase(); return Object.values(item).some(v => String(v).toLowerCase().includes(q)); });
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  const load = async () => { try { setItems(await adminFetchSubscribers()); } catch (err) { toast.error(err.message); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);
  const handleDelete = async (id) => { if (!confirm('Remove this subscriber?')) return; setDeleting(id); try { await adminDeleteSubscriber(id); toast.success('Subscriber removed'); load(); } catch (err) { toast.error(err.message); } finally { setDeleting(null); } };
  const exportCSV = () => { window.open(`${API_URL}/export/subscribers`, '_blank'); };

  return (
    <AdminLayout title="Subscribers">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 shrink-0">{items.length} subscribers</p>
          <div className="flex gap-2">
            <button onClick={exportCSV} className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"><HiOutlineDownload className="w-4 h-4" /> CSV</button>
            <input placeholder="Search..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="px-3 py-1.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm dark:bg-gray-800 dark:text-gray-200 w-48" />
          </div>
        </div>
        <div className="p-6">
          {loading ? <p className="text-gray-400 dark:text-gray-500 text-center py-8">Loading...</p> : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                      <th className="pb-3 pr-4">Email</th>
                      <th className="pb-3 pr-4">Subscribed</th>
                      <th className="pb-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paged.map((item) => (
                      <tr key={item.id} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <td className="py-3 pr-4 text-sm font-medium text-gray-800 dark:text-gray-100">{item.email}</td>
                        <td className="py-3 pr-4 text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">{new Date(item.created_at).toLocaleDateString()}</td>
                        <td className="py-3">
                          <button onClick={() => handleDelete(item.id)} disabled={deleting === item.id} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-40"><HiOutlineTrash className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && <tr><td colSpan="3" className="py-8 text-center text-gray-400 dark:text-gray-500 text-sm">{items.length === 0 ? 'No subscribers yet' : 'No matching results'}</td></tr>}
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
    </AdminLayout>
  );
}
