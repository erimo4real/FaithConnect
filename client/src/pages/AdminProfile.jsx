import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../store/authSlice';
import AdminLayout from './admin/AdminLayout';
import { adminUpdateProfile, adminChangePassword, adminUpdateAvatar, uploadFile } from '../services/api';
import { useToast } from '../context/ToastContext';
import { optimizeCloudinaryUrl } from '../utils/cloudinary';

export default function AdminProfile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const toast = useToast();
  const fileRef = useRef(null);

  const [preview, setPreview] = useState(null);
  const [pendingFile, setPendingFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const [pwOpen, setPwOpen] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  useEffect(() => {
    return () => { if (preview) URL.revokeObjectURL(preview); };
  }, [preview]);

  const imgSrc = (src) => src;

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (preview) URL.revokeObjectURL(preview);
    setPendingFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSavePhoto = async () => {
    if (!pendingFile) return;
    setUploading(true);
    try {
      const data = await uploadFile(pendingFile);
      const updated = await adminUpdateAvatar(data.url);
      dispatch(setUser(updated));
      toast.success('Profile photo updated');
      setPreview(null);
      setPendingFile(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const cancelPreview = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setPendingFile(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleRemove = async () => {
    try {
      const updated = await adminUpdateAvatar('');
      dispatch(setUser(updated));
      toast.success('Profile photo removed');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const updated = await adminUpdateProfile({ name, email });
      dispatch(setUser(updated));
      toast.success('Profile updated!');
      setEditing(false);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPw !== confirmPw) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      await adminChangePassword({ currentPassword: currentPw, newPassword: newPw });
      toast.success('Password changed!');
      setPwOpen(false);
      setCurrentPw('');
      setNewPw('');
      setConfirmPw('');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const currentSrc = preview || (user?.avatar_url ? optimizeCloudinaryUrl(user.avatar_url, { width: 300 }) : null);

  return (
    <AdminLayout>
      <div className="max-w-6xl space-y-8">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Profile Photo card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">Profile Photo</h2>
            <div className="flex flex-col items-center gap-5">
              <div className="relative shrink-0">
                {currentSrc ? (
                  <img
                    src={currentSrc}
                    alt="Preview"
                    className="w-36 h-36 rounded-full object-cover border-4 border-gray-100"
                  />
                ) : (
                  <div className="w-36 h-36 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-5xl border-4 border-gray-100">
                    {user?.name?.charAt(0) || 'A'}
                  </div>
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
                    <svg className="animate-spin w-8 h-8 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                  </div>
                )}
                {preview && !uploading && (
                  <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full shadow">
                    Preview
                  </div>
                )}
              </div>

              <div className="flex flex-col items-center gap-2">
                <input ref={fileRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />

                {preview ? (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSavePhoto}
                      disabled={uploading}
                      className="px-5 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {uploading ? 'Uploading...' : 'Save Photo'}
                    </button>
                    <button
                      onClick={cancelPreview}
                      disabled={uploading}
                      className="px-5 py-2 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="px-5 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    Choose Photo
                  </button>
                )}

                {user?.avatar_url && !preview && (
                  <button
                    onClick={handleRemove}
                    className="text-sm text-red-500 hover:text-red-700 transition-colors"
                  >
                    Remove current photo
                  </button>
                )}

                <p className="text-xs text-gray-400 dark:text-gray-500">JPG, PNG or GIF. Max 200MB.</p>
              </div>
            </div>
          </div>

          {/* Profile Information card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Profile Information</h2>
              <button
                onClick={() => setEditing(!editing)}
                className="text-sm text-primary hover:underline font-medium"
              >
                {editing ? 'Cancel' : 'Edit'}
              </button>
            </div>

            <div className="flex items-center gap-4 mb-6">
              {user?.avatar_url ? (
                <img src={optimizeCloudinaryUrl(user.avatar_url, { width: 80 })} alt={user?.name} className="w-16 h-16 rounded-full object-cover" />
              ) : (
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-2xl">
                  {user?.name?.charAt(0) || 'A'}
                </div>
              )}
              <div>
                <p className="font-semibold text-gray-800 dark:text-gray-100 text-lg">{user?.name}</p>
                <p className="text-gray-400 dark:text-gray-500 text-sm capitalize">{user?.role}</p>
              </div>
            </div>

            {editing ? (
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition"
                >
                  Save Changes
                </button>
              </form>
            ) : (
              <div className="space-y-3 text-sm">
                <div><span className="text-gray-400 dark:text-gray-500">Name:</span> <span className="text-gray-700 dark:text-gray-200 ml-2">{user?.name}</span></div>
                <div><span className="text-gray-400 dark:text-gray-500">Email:</span> <span className="text-gray-700 dark:text-gray-200 ml-2">{user?.email}</span></div>
                <div><span className="text-gray-400 dark:text-gray-500">Role:</span> <span className="text-gray-700 dark:text-gray-200 ml-2 capitalize">{user?.role}</span></div>
                <div><span className="text-gray-400 dark:text-gray-500">Member since:</span> <span className="text-gray-700 dark:text-gray-200 ml-2">{user?.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}</span></div>
              </div>
            )}
          </div>

        </div>

        {/* Change password card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Password</h2>
            <button
              onClick={() => setPwOpen(!pwOpen)}
              className="text-sm text-primary hover:underline font-medium"
            >
              {pwOpen ? 'Cancel' : 'Change'}
            </button>
          </div>
          {pwOpen && (
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Current Password</label>
                <input
                  type="password"
                  value={currentPw}
                  onChange={(e) => setCurrentPw(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">New Password</label>
                <input
                  type="password"
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
              <button
                type="submit"
                className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition"
              >
                Change Password
              </button>
            </form>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
