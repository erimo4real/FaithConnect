import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import StatsCard from '../../components/admin/StatsCard';
import AdminLayout from './AdminLayout';
import {
  adminFetchSermons,
  adminFetchEvents,
  adminFetchBlogPosts,
  adminFetchGalleryItems,
  adminFetchStreams,
  adminFetchPrayerRequests,
  adminFetchContactMessages,
  adminFetchDonations,
  adminFetchOrders,
  adminFetchSubscribers,
  adminFetchUsers,
} from '../../services/api';

export default function AdminDashboard() {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({});
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminFetchSermons(),
      adminFetchEvents(),
      adminFetchBlogPosts(),
      adminFetchGalleryItems(),
      adminFetchStreams(),
      adminFetchPrayerRequests(),
      adminFetchContactMessages(),
      adminFetchDonations(),
      adminFetchOrders(),
      adminFetchSubscribers(),
      adminFetchUsers(),
    ])
      .then(([sermons, events, blog, gallery, streams, prayer, contact, donations, orders, subscribers, users]) => {
        setStats({
          sermons: sermons.length || 0,
          events: events.length || 0,
          blog: blog.length || 0,
          gallery: gallery.length || 0,
          streams: streams.length || 0,
          prayer: prayer.length || 0,
          contact: contact.length || 0,
          donations: donations.length || 0,
          orders: orders.length || 0,
          subscribers: subscribers.length || 0,
          users: users.length || 0,
        });
        const all = [
          ...sermons.slice(0, 3).map((s) => ({ type: 'Sermon', title: s.title, date: s.created_at })),
          ...events.slice(0, 3).map((e) => ({ type: 'Event', title: e.title, date: e.created_at })),
          ...blog.slice(0, 3).map((b) => ({ type: 'Blog', title: b.title, date: b.created_at })),
        ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
        setRecent(all);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
        </div>
      </AdminLayout>
    );
  }

  const colors = ['blue', 'green', 'orange', 'purple', 'pink', 'teal'];
  const statCards = [
    { title: 'Sermons', value: stats.sermons, link: '/admin/sermons', color: colors[0] },
    { title: 'Events', value: stats.events, link: '/admin/events', color: colors[1] },
    { title: 'Blog Posts', value: stats.blog, link: '/admin/blog', color: colors[2] },
    { title: 'Gallery', value: stats.gallery, link: '/admin/gallery', color: colors[3] },
    { title: 'Streams', value: stats.streams, link: '/admin/streams', color: colors[4] },
    { title: 'Prayer', value: stats.prayer, link: '/admin/prayer', color: colors[5] },
    { title: 'Contact', value: stats.contact, link: '/admin/contact', color: colors[0] },
    { title: 'Donations', value: stats.donations, link: '/admin/donations', color: colors[1] },
    { title: 'Orders', value: stats.orders, link: '/admin/orders', color: colors[2] },
    { title: 'Subscribers', value: stats.subscribers, link: '/admin/subscribers', color: colors[3] },
    { title: 'Users', value: stats.users, link: '/admin/users', color: colors[4] },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Welcome, {user?.name || 'Admin'}!</h2>
          <p className="text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-1">Here is what is happening with your church platform today.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {statCards.map((s) => (
            <Link key={s.title} to={s.link}>
              <StatsCard title={s.title} value={s.value} color={s.color} />
            </Link>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Recent Activity</h3>
          {recent.length === 0 ? (
            <p className="text-gray-400 dark:text-gray-500 text-sm">No recent activity.</p>
          ) : (
            <div className="space-y-3">
              {recent.map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <span className="w-2 h-2 rounded-full bg-primary/40" />
                  <span className="text-gray-500 dark:text-gray-400 dark:text-gray-500 min-w-[60px]">{item.type}</span>
                  <span className="text-gray-700 dark:text-gray-200 font-medium truncate">{item.title}</span>
                  <span className="text-gray-400 dark:text-gray-500 ml-auto text-xs">
                    {new Date(item.date).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
