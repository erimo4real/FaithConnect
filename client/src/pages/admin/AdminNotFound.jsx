import { Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';

export default function AdminNotFound() {
  return (
    <AdminLayout title="404">
      <div className="flex flex-col items-center justify-center py-20">
        <h1 className="text-8xl font-bold text-gray-200 dark:text-gray-700 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Page Not Found</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">The admin page you're looking for doesn't exist.</p>
        <Link to="/admin" className="px-6 py-2.5 bg-primary text-white rounded-xl hover:bg-accent transition-colors font-medium">
          Back to Dashboard
        </Link>
      </div>
    </AdminLayout>
  );
}
