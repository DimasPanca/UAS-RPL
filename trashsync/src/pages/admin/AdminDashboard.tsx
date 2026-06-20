import React, { useState, useEffect } from 'react';
import {
  Trash2, AlertTriangle, FileText, Truck, Activity, TrendingUp, Clock
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { BinStatusBadge } from '../../components/UI/StatusBadge';
import { FillBar } from '../../components/UI/FillBar';
import { PageSkeleton } from '../../components/UI/SkeletonCard';
import { formatDateTime, formatDate } from '../../data/mockData';

const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
}> = ({ icon, label, value, sub, color }) => (
  <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5 flex items-start gap-4">
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-xs text-slate-400 font-medium">{label}</p>
      <p className="text-2xl font-bold text-slate-100">{value}</p>
      {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
    </div>
  </div>
);

export const AdminDashboard: React.FC = () => {
  const { bins, reports, collectionHistory, sensorHistory, currentUser } = useApp();
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  if (loading) return <PageSkeleton />;

  const penuh = bins.filter(b => b.status === 'penuh').length;
  const pending = reports.filter(r => r.status === 'Pending').length;
  const today = new Date().toDateString();
  const todayCollections = collectionHistory.filter(
    c => new Date(c.completedAt).toDateString() === today
  ).length;

  const chartData = sensorHistory.map(h => ({
    date: formatDate(h.date),
    'Gerbang Utama': h.fills['bin-001'],
    'Taman Bermain': h.fills['bin-002'],
    'Lapangan': h.fills['bin-003'],
    'Blok Timur': h.fills['bin-004'],
    'Blok Barat': h.fills['bin-005'],
  }));

  const recentActivity = [
    ...collectionHistory.slice(0, 3).map(c => ({
      type: 'collection' as const,
      text: `Pengangkutan ${c.binName} oleh ${c.petugasName}`,
      time: c.completedAt,
    })),
    ...reports.slice(0, 2).map(r => ({
      type: 'report' as const,
      text: `Laporan ${r.category}: ${r.binName} oleh ${r.reporterName}`,
      time: r.submittedAt,
    })),
  ]
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 5);

  const greeting = now.getHours() < 12 ? 'Selamat Pagi' : now.getHours() < 17 ? 'Selamat Siang' : 'Selamat Malam';

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">
            {greeting}, {currentUser?.name?.split(' ')[0]}!
          </h1>
          <p className="text-slate-400 text-sm mt-1">Monitoring sistem berjalan normal</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-400 bg-slate-800/60 border border-slate-700/50 px-4 py-2 rounded-xl">
          <Clock size={14} className="text-emerald-400" />
          {now.toLocaleString('id-ID', {
            weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit',
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Trash2 size={20} className="text-emerald-400" />}
          label="Total Tempat Sampah" value={bins.length} sub="Unit terpasang"
          color="bg-emerald-500/15"
        />
        <StatCard
          icon={<AlertTriangle size={20} className="text-red-400" />}
          label="Bin Penuh (>80%)" value={penuh} sub="Perlu segera diangkut"
          color="bg-red-500/15"
        />
        <StatCard
          icon={<FileText size={20} className="text-amber-400" />}
          label="Laporan Pending" value={pending} sub="Belum diverifikasi"
          color="bg-amber-500/15"
        />
        <StatCard
          icon={<Truck size={20} className="text-blue-400" />}
          label="Pengangkutan Hari Ini" value={todayCollections} sub="Selesai dilakukan"
          color="bg-blue-500/15"
        />
      </div>

      {/* Bin Cards */}
      <div>
        <h2 className="text-base font-semibold text-slate-200 mb-3 flex items-center gap-2">
          <Activity size={16} className="text-emerald-400" />
          Status Real-time
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {bins.map(bin => (
            <div
              key={bin.id}
              className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4 hover:border-slate-600 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-slate-700/60 flex items-center justify-center">
                  <Trash2 size={16} className="text-slate-300" />
                </div>
                <BinStatusBadge status={bin.status} />
              </div>
              <h3 className="text-sm font-semibold text-slate-200 mb-1 leading-tight">{bin.name}</h3>
              <p className="text-xs text-slate-500 mb-3">{bin.location}</p>
              <FillBar percentage={bin.currentFill} height="h-1.5" />
              <div className="flex items-center justify-between mt-2">
                <span className={`text-lg font-bold ${
                  bin.currentFill >= 80 ? 'text-red-400' :
                  bin.currentFill >= 50 ? 'text-amber-400' : 'text-emerald-400'
                }`}>{bin.currentFill}%</span>
                <span className="text-[10px] text-slate-500">
                  {formatDateTime(bin.lastUpdated).split(',')[1]?.trim()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chart + Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
          <h2 className="text-base font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-emerald-400" />
            Tren Pengisian 7 Hari Terakhir
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
              <defs>
                {['#10b981', '#3b82f6', '#f59e0b', '#a855f7', '#ef4444'].map((color, i) => (
                  <linearGradient key={i} id={`grad${i}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', fontSize: '12px' }}
                labelStyle={{ color: '#94a3b8' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
              {Object.keys(chartData[0]).filter(k => k !== 'date').map((key, i) => {
                const colors = ['#10b981', '#3b82f6', '#f59e0b', '#a855f7', '#ef4444'];
                return (
                  <Area key={key} type="monotone" dataKey={key}
                    stroke={colors[i]} strokeWidth={2}
                    fill={`url(#grad${i})`} dot={false}
                  />
                );
              })}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
          <h2 className="text-base font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <Activity size={16} className="text-emerald-400" />
            Aktivitas Terbaru
          </h2>
          <ul className="space-y-3">
            {recentActivity.map((act, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${
                  act.type === 'collection' ? 'bg-blue-400' : 'bg-amber-400'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-slate-300 text-xs leading-snug">{act.text}</p>
                  <p className="text-slate-500 text-[10px] mt-0.5">{formatDateTime(act.time)}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
