import { useState, useEffect, useRef } from 'react';
import { adminFetchUsers, adminUpdateUser, adminDeleteUser, uploadFile } from '../../services/api';
import { registerAdmin } from '../../services/api';
import AdminLayout from './AdminLayout';
import { useToast } from '../../context/ToastContext';
import { HiOutlineTrash, HiOutlinePencil, HiOutlinePlus, HiOutlinePhotograph, HiOutlineUser } from 'react-icons/hi';
import { optimizeCloudinaryUrl } from '../../utils/cloudinary';

export default function AdminUsers() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [editUser, setEditUser] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [adding, setAdding] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const avatarRef = useRef(null);
  const pageSize = 10;

  const filtered = items.filter(item => { if (!search) return true; const q = search.toLowerCase(); return Object.values(item).some(v => String(v).toLowerCase().includes(q)); });
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  const load = async () => {
    try { setItems(await adminFetchUsers()); }
    catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this admin user?')) return;
    setDeleting(id);
    try { await adminDeleteUser(id); toast.success('User deleted'); load(); }
    catch (err) { toast.error(err.message); }
    finally { setDeleting(null); }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminUpdateUser(editUser.id, { name: editUser.name, email: editUser.email, role: editUser.role, avatar_url: editUser.avatar_url });
      toast.success('User updated');
      setEditUser(null);
      load();
    } catch (err) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  const handleAvatarUpload = async (file) => {
    if (!file) return;
    setAvatarUploading(true);
    try {
      const data = await uploadFile(file);
      setEditUser(u => ({ ...u, avatar_url: data.url }));
      toast.success('Photo uploaded');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setAvatarUploading(false);
      if (avatarRef.current) avatarRef.current.value = '';
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setAdding(true);
    const form = e.target;
    try {
      await registerAdmin(form.name.value, form.email.value, form.password.value);
      toast.success('User created');
      setShowAdd(false);
      load();
    } catch (err) { toast.error(err.message); }
    finally { setAdding(false); }
  };

  return (
    <AdminLayout title="Admin Users">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 shrink-0">{items.length} admin users</p>
          <div className="flex gap-2">
            <input placeholder="Search..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="px-3 py-1.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm dark:bg-gray-800 dark:text-gray-200 w-48" />
            <button onClick={() => setShowAdd(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"><HiOutlinePlus className="w-4 h-4" /> Add User</button>
          </div>
        </div>
        <div className="p-6">
          {loading ? <p className="text-gray-400 dark:text-gray-500 text-center py-8">Loading...</p> : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                      <th className="pb-3 pr-4">Avatar</th>
                      <th className="pb-3 pr-4">Name</th>
                      <th className="pb-3 pr-4">Email</th>
                      <th className="pb-3 pr-4">Role</th>
                      <th className="pb-3 pr-4">Created</th>
                      <th className="pb-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paged.map((item) => (
                      <tr key={item.id} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <td className="py-3 pr-4">
                          {item.avatar_url ? (
                            <img src={optimizeCloudinaryUrl(item.avatar_url, { width: 40 })} alt="" className="w-8 h-8 rounded-full object-cover" />
                          ) : (
                            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary"><HiOutlineUser className="w-5 h-5" /></div>
                          )}
                        </td>
                        <td className="py-3 pr-4 text-sm font-medium text-gray-800 dark:text-gray-100">{item.name}</td>
                        <td className="py-3 pr-4 text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">{item.email}</td>
                        <td className="py-3 pr-4"><span className="text-xs px-2 py-1 rounded-lg bg-primary/10 text-primary font-medium capitalize">{item.role}</span></td>
                        <td className="py-3 pr-4 text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">{new Date(item.created_at).toLocaleDateString()}</td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <button onClick={() => setEditUser({ ...item })} className="p-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"><HiOutlinePencil className="w-4 h-4" /></button>
                            <button onClick={() => handleDelete(item.id)} disabled={deleting === item.id} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-40"><HiOutlineTrash className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && <tr><td colSpan="6" className="py-8 text-center text-gray-400 dark:text-gray-500 text-sm">{items.length === 0 ? 'No users yet' : 'No matching results'}</td></tr>}
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

      {/* Edit modal */}
      {editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setEditUser(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Edit User</h3>
            <form onSubmit={handleEdit} className="space-y-4">
              <div className="flex items-center gap-4 mb-2">
                {editUser.avatar_url ? (
                  <img src={optimizeCloudinaryUrl(editUser.avatar_url, { width: 60 })} alt="" className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary"><HiOutlineUser className="w-6 h-6" /></div>
                )}
                <div>
                  <input type="file" accept="image/*" ref={avatarRef} onChange={e => { const f = e.target.files?.[0]; if (f) handleAvatarUpload(f); }} className="hidden" />
                  <button type="button" onClick={() => avatarRef.current?.click()} disabled={avatarUploading} className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50">
                    <HiOutlinePhotograph className="w-4 h-4" /> {avatarUploading ? 'Uploading...' : 'Change Photo'}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Name</label>
                <input type="text" value={editUser.name} onChange={e => setEditUser(u => ({ ...u, name: e.target.value }))} required className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Email</label>
                <input type="email" value={editUser.email} onChange={e => setEditUser(u => ({ ...u, email: e.target.value }))} required className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Role</label>
                <select value={editUser.role} onChange={e => setEditUser(u => ({ ...u, role: e.target.value }))} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={() => setEditUser(null)} className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cancel</button>
                <button type="submit" disabled={saving} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">{saving ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add user modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowAdd(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Add Admin User</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Name</label>
                <input name="name" type="text" required className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Email</label>
                <input name="email" type="email" required className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Password</label>
                <input name="password" type="password" required minLength={6} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cancel</button>
                <button type="submit" disabled={adding} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">{adding ? 'Creating...' : 'Create User'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
