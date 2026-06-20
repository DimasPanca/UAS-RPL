import React, { useState, useEffect } from 'react';
import { Download, Calendar, BarChart2, Truck, FileText, TrendingUp } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FillBar } from '../../components/UI/FillBar';
import { PageSkeleton } from '../../components/UI/SkeletonCard';

const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

export const RekapBulanan: React.FC = () => {
  const { bins, reports, collectionHistory, addToast } = useApp();
  const [loading, setLoading] = useState(true);
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const handleExport = () => {
    addToast('info', 'Fitur ekspor akan segera tersedia');
  };

  // Mock recap per bin
  const recap = bins.map(bin => {
    const collections = collectionHistory.filter(c => c.binId === bin.id);
    const binReports = reports.filter(r => r.binId === bin.id);
    const avgFill = collections.length > 0
      ? Math.round(collections.reduce((s, c) => s + c.fillBefore, 0) / collections.length)
      : bin.currentFill;
    return {
      binId: bin.id,
      binName: bin.name,
      totalCollections: collections.length + Math.floor(Math.random() * 3),
      totalReports: binReports.length,
      avgFill,
      currentFill: bin.currentFill,
    };
  });

  const totalCollections = recap.reduce((s, r) => s + r.totalCollections, 0);
  const totalReports = reports.length;
  const overallAvgFill = Math.round(recap.reduce((s, r) => s + r.avgFill, 0) / recap.length);

  if (loading) return <PageSkeleton />;

  return (
    <div className="space-y-5 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Rekap Bulanan</h1>
          <p className="text-slate-400 text-sm mt-1">Ringkasan aktivitas pengangkutan dan laporan</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-slate-800/60 border border-slate-700/50 rounded-xl px-3 py-2">
            <Calendar size={14} className="text-emerald-400" />
            <select
              value={month}
              onChange={e => setMonth(Number(e.target.value))}
              className="bg-transparent text-sm text-slate-200 focus:outline-none"
            >
              {MONTHS.map((m, i) => <option key={i} value={i} className="bg-slate-800">{m}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2 bg-slate-800/60 border border-slate-700/50 rounded-xl px-3 py-2">
            <select
              value={year}
              onChange={e => setYear(Number(e.target.value))}
              className="bg-transparent text-sm text-slate-200 focus:outline-none"
            >
              {[2024, 2025, 2026].map(y => <option key={y} value={y} className="bg-slate-800">{y}</option>)}
            </select>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-emerald-500/20"
          >
            <Download size={15} />
            Cetak / Export PDF
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            icon: <Truck size={20} className="text-blue-400" />,
            label: 'Total Pengangkutan',
            value: totalCollections,
            sub: `${MONTHS[month]} ${year}`,
            color: 'bg-blue-500/15',
          },
          {
            icon: <FileText size={20} className="text-amber-400" />,
            label: 'Total Laporan',
            value: totalReports,
            sub: 'Dari semua warga',
            color: 'bg-amber-500/15',
          },
          {
            icon: <TrendingUp size={20} className="text-emerald-400" />,
            label: 'Rata-rata Level Isi',
            value: `${overallAvgFill}%`,
            sub: 'Semua tempat sampah',
            color: 'bg-emerald-500/15',
          },
        ].map(card => (
          <div key={card.label} className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5 flex items-start gap-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${card.color}`}>
              {card.icon}
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">{card.label}</p>
              <p className="text-2xl font-bold text-slate-100">{card.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{card.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Per-bin Table */}
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-700/60 flex items-center gap-2">
          <BarChart2 size={16} className="text-emerald-400" />
          <h2 className="text-base font-semibold text-slate-200">Detail Per Tempat Sampah — {MONTHS[month]} {year}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/60">
                {['Lokasi', 'Total Pengangkutan', 'Total Laporan', 'Avg Level Isi', 'Level Saat Ini'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/40">
              {recap.map(row => (
                <tr key={row.binId} className="hover:bg-slate-700/20 transition-colors">
                  <td className="px-5 py-4">
                    <span className="text-sm font-medium text-slate-200">{row.binName}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-slate-300">{row.totalCollections}x</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-slate-300">{row.totalReports}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3 min-w-[120px]">
                      <FillBar percentage={row.avgFill} height="h-1.5" />
                      <span className="text-xs text-slate-400 shrink-0">{row.avgFill}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3 min-w-[120px]">
                      <FillBar percentage={row.currentFill} height="h-1.5" />
                      <span className="text-xs text-slate-400 shrink-0">{row.currentFill}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
