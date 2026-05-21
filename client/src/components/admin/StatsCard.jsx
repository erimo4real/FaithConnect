export default function StatsCard({ title, value, icon: Icon, color, subtitle }) {
  const gradients = {
    blue: 'from-primary to-accent',
    green: 'from-green-500 to-emerald-600',
    orange: 'from-orange-500 to-red-500',
    purple: 'from-purple-500 to-indigo-600',
    pink: 'from-pink-500 to-rose-500',
    teal: 'from-teal-500 to-cyan-600',
  };

  const gradient = gradients[color] || gradients.blue;

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`}></div>
      <div className="relative p-5 text-white">
        <div className="flex items-center justify-between mb-3">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
            {Icon && <Icon className="w-6 h-6" />}
          </div>
        </div>
        <p className="text-3xl font-bold mb-0.5">{value}</p>
        <p className="text-sm text-white/80 font-medium">{title}</p>
        {subtitle && <p className="text-xs text-white/60 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}
