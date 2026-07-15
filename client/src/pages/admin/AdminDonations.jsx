import { useState, useEffect, useCallback } from 'react';
import { adminFetchDonations, adminUpdateDonation, adminDeleteDonation, adminCancelSubscription, adminRefundDonation, adminResendReceipt } from '../../services/api';
import AdminLayout from './AdminLayout';
import { useToast } from '../../context/ToastContext';
import { HiOutlineTrash, HiOutlineEye, HiOutlineDownload, HiOutlineSearch, HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export default function AdminDonations() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [updating, setUpdating] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [cancelling, setCancelling] = useState(null);
  const [refunding, setRefunding] = useState(null);
  const [resending, setResending] = useState(null);
  const limit = 10;

  const toast = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await adminFetchDonations(page, limit, search, statusFilter);
      if (result.data) {
        setItems(result.data);
        setTotal(result.total);
      } else {
        setItems(result);
        setTotal(result.length);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => { load(); }, [load]);

  const totalPages = Math.ceil(total / limit);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleStatusFilter = (s) => {
    setStatusFilter(s);
    setPage(1);
  };

  const exportCSV = () => { window.open(`${API_URL}/export/donations`, '_blank'); };

  const handleStatus = async (id, status) => {
    setUpdating(id);
    try { await adminUpdateDonation(id, { status }); toast.success('Status updated'); load(); }
    catch (err) { toast.error(err.message); }
    finally { setUpdating(null); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this donation record?')) return;
    setDeleting(id);
    try { await adminDeleteDonation(id); toast.success('Donation deleted'); load(); }
    catch (err) { toast.error(err.message); }
    finally { setDeleting(null); }
  };

  const handleCancelSubscription = async (id) => {
    if (!confirm('Cancel this recurring subscription? The donor will no longer be charged.')) return;
    setCancelling(id);
    try { await adminCancelSubscription(id); toast.success('Subscription cancelled'); load(); }
    catch (err) { toast.error(err.message); }
    finally { setCancelling(null); }
  };

  const handleRefund = async (id) => {
    if (!confirm('Refund this donation? The full amount will be returned to the donor.')) return;
    setRefunding(id);
    try { await adminRefundDonation(id); toast.success('Donation refunded'); load(); setSelected(null); }
    catch (err) { toast.error(err.message); }
    finally { setRefunding(null); }
  };

  const handleResendReceipt = async (id) => {
    setResending(id);
    try { await adminResendReceipt(id); toast.success('Receipt re-sent'); }
    catch (err) { toast.error(err.message); }
    finally { setResending(null); }
  };

  const statusColor = (s) => {
    if (s === 'completed') return 'bg-green-100 dark:bg-green-900/30 text-green-700';
    if (s === 'pending') return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700';
    if (s === 'cancelled') return 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400';
    return 'bg-red-100 dark:bg-red-900/30 text-red-700';
  };

  const statuses = ['', 'pending', 'completed', 'failed', 'cancelled'];

  return (
    <AdminLayout title="Donations">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 ${selected ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex flex-wrap items-center gap-3">
            <p className="text-sm text-gray-500 dark:text-gray-400 shrink-0">{total} donations</p>
            <form onSubmit={handleSearch} className="relative flex-1 min-w-[200px] max-w-xs">
              <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                placeholder="Search name, email, reference..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none dark:bg-gray-800 dark:text-gray-200"
              />
            </form>
            <div className="flex gap-1 bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
              {statuses.map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusFilter(s)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors capitalize ${
                    statusFilter === s
                      ? 'bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-100 shadow-sm'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                >
                  {s || 'All'}
                </button>
              ))}
            </div>
            <button onClick={exportCSV} className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"><HiOutlineDownload className="w-4 h-4" /> CSV</button>
          </div>
          <div className="p-6">
            {loading ? <p className="text-gray-400 dark:text-gray-500 text-center py-8">Loading...</p> : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                        <th className="pb-3 pr-4">Donor</th>
                        <th className="pb-3 pr-4">Amount</th>
                        <th className="pb-3 pr-4">Type</th>
                        <th className="pb-3 pr-4">Status</th>
                        <th className="pb-3 pr-4">Date</th>
                        <th className="pb-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <tr key={item.id} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                          <td className="py-3 pr-4 text-sm font-medium text-gray-800 dark:text-gray-100">{item.name}</td>
                          <td className="py-3 pr-4 text-sm font-semibold text-gray-800 dark:text-gray-100">₦{Number(item.amount).toLocaleString()}</td>
                          <td className="py-3 pr-4"><span className="text-xs capitalize px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">{item.type}</span></td>
                          <td className="py-3 pr-4">
                            <span className={`text-xs px-2 py-1 rounded-lg font-medium ${statusColor(item.status)}`}>{item.status}</span>
                          </td>
                          <td className="py-3 pr-4 text-sm text-gray-500 dark:text-gray-400">{new Date(item.created_at).toLocaleDateString()}</td>
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              <button onClick={() => setSelected(item)} className="p-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"><HiOutlineEye className="w-4 h-4" /></button>
                              <select value={item.status} onChange={(e) => handleStatus(item.id, e.target.value)} disabled={updating === item.id} className="border border-gray-200 dark:border-gray-600 rounded-lg text-xs p-1.5 outline-none focus:ring-2 focus:ring-primary disabled:opacity-40 dark:bg-gray-800 dark:text-gray-200">
                                <option value="pending">Pending</option>
                                <option value="completed">Completed</option>
                                <option value="failed">Failed</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                              {item.subscription_code && item.status === 'completed' && (
                                <button
                                  onClick={() => handleCancelSubscription(item.id)}
                                  disabled={cancelling === item.id}
                                  className="p-1.5 text-orange-600 hover:bg-orange-50 rounded-lg disabled:opacity-40 text-xs font-medium"
                                  title="Cancel recurring"
                                >
                                  Stop
                                </button>
                              )}
                              {item.status === 'completed' && (
                                <button
                                  onClick={() => handleResendReceipt(item.id)}
                                  disabled={resending === item.id}
                                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg disabled:opacity-40 text-xs"
                                  title="Resend receipt"
                                >
                                  Email
                                </button>
                              )}
                              <button onClick={() => handleDelete(item.id)} disabled={deleting === item.id} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-40"><HiOutlineTrash className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {items.length === 0 && <tr><td colSpan="6" className="py-8 text-center text-gray-400 dark:text-gray-500 text-sm">No donations found</td></tr>}
                    </tbody>
                  </table>
                </div>
                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700 mt-4">
                    <p className="text-sm text-gray-400 dark:text-gray-500">Page {page} of {totalPages} ({total} total)</p>
                    <div className="flex gap-2">
                      <button
                        disabled={page <= 1}
                        onClick={() => setPage(p => p - 1)}
                        className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <HiOutlineChevronLeft className="w-4 h-4" /> Previous
                      </button>
                      <button
                        disabled={page >= totalPages}
                        onClick={() => setPage(p => p + 1)}
                        className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        Next <HiOutlineChevronRight className="w-4 h-4" />
                      </button>
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
            <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">{selected.email}{selected.phone ? ` | ${selected.phone}` : ''}</p>
            <div className="space-y-3">
              <div><p className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500">Amount</p><p className="text-2xl font-bold text-primary">₦{Number(selected.amount).toLocaleString()}</p></div>
              <div><p className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500">Type</p><p className="text-sm text-gray-700 dark:text-gray-200 capitalize">{selected.type}</p></div>
              <div><p className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500">Cause</p><p className="text-sm text-gray-700 dark:text-gray-200 capitalize">{selected.cause}</p></div>
              <div><p className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500">Reference</p><p className="text-sm text-gray-700 dark:text-gray-200">{selected.reference || '-'}</p></div>
              <div><p className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500">Status</p><p className="text-sm text-gray-700 dark:text-gray-200 capitalize">{selected.status}</p></div>
              <div><p className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500">Subscription</p><p className="text-sm text-gray-700 dark:text-gray-200">{selected.subscription_code || 'One-time'}</p></div>
              {selected.message && <div><p className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500">Message</p><p className="text-sm text-gray-700 dark:text-gray-200">{selected.message}</p></div>}
            </div>
            {selected.subscription_code && selected.status === 'completed' && (
              <button
                onClick={() => { handleCancelSubscription(selected.id); setSelected(null); }}
                className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors"
              >
                Cancel Recurring
              </button>
            )}
            {selected.status === 'completed' && (
              <>
                <button onClick={() => handleResendReceipt(selected.id)} disabled={resending === selected.id} className="mt-4 ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors disabled:opacity-40">
                  {resending === selected.id ? 'Sending...' : 'Resend Receipt'}
                </button>
                <button onClick={() => handleRefund(selected.id)} disabled={refunding === selected.id} className="mt-4 ml-2 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-40">
                  {refunding === selected.id ? 'Refunding...' : 'Refund'}
                </button>
              </>
            )}
            <button onClick={() => setSelected(null)} className="mt-4 ml-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:text-gray-200">Close</button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
