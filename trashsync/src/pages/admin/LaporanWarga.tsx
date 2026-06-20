import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Filter } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { ReportStatus } from '../../types';
import { ReportStatusBadge } from '../../components/UI/StatusBadge';
import { PageSkeleton } from '../../components/UI/SkeletonCard';
import { formatDateTime } from '../../data/mockData';

const categoryColor: Record<string, string> = {
  Penuh: 'bg-red-500/15 text-red-400',
  Rusak: 'bg-orange-500/15 text-orange-400',
  Bau: 'bg-yellow-500/15 text-yellow-400',
  Lainnya: 'bg-slate-500/15 text-slate-400',
};

type FilterStatus = 'Semua' | ReportStatus;

export const LaporanWarga: React.FC = () => {
  const { reports, updateReportStatus, addToast } = useApp();
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>('Semua');

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const filtered = filter === 'Semua' ? reports : reports.filter(r => r.status === filter);

  const handleVerify = (id: string) => {
    updateReportStatus(id, 'Terverifikasi');
    addToast('success', 'Laporan berhasil diverifikasi');
  };

  const handleReject = (id: string) => {
    updateReportStatus(id, 'Ditolak');
    addToast('info', 'Laporan telah ditolak');
  };

  const counts: Record<FilterStatus, number> = {
    Semua: reports.length,
    Pending: reports.filter(r => r.status === 'Pending').length,
    Terverifikasi: reports.filter(r => r.status === 'Terverifikasi').length,
    Ditolak: reports.filter(r => r.status === 'Ditolak').length,
  };

  if (loading) return <PageSkeleton />;

  return (
    <div className="space-y-5 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Laporan Warga</h1>
        <p className="text-slate-400 text-sm mt-1">{counts.Pending} laporan menunggu verifikasi</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 items-center">
        <Filter size={14} className="text-slate-400" />
        {(['Semua', 'Pending', 'Terverifikasi', 'Ditolak'] as FilterStatus[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              filter === f
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 bg-slate-800/60 border border-slate-700/50 hover:border-slate-600'
            }`}
          >
            {f} <span className="opacity-70">({counts[f]})</span>
          </button>
        ))}
      </div>

      <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/60">
                {['Pelapor', 'Lokasi', 'Kategori', 'Deskripsi', 'Waktu', 'Status', 'Aksi'].map(h => (
                  <th key={h} className={`text-${h === 'Aksi' ? 'right' : 'left'} text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3 whitespace-nowrap`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/40">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-slate-500 py-8 text-sm">
                    Tidak ada laporan
                  </td>
                </tr>
              ) : filtered.map(report => (
                <tr key={report.id} className="hover:bg-slate-700/20 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold shrink-0">
                        {report.reporterName.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-slate-200 whitespace-nowrap">{report.reporterName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-slate-300 whitespace-nowrap">{report.binName}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${categoryColor[report.category]}`}>
                      {report.category}
                    </span>
                  </td>
                  <td className="px-5 py-4 max-w-xs">
                    <p className="text-xs text-slate-400 line-clamp-2">{report.description}</p>
                    {report.photoName && (
                      <span className="text-[10px] text-blue-400 mt-0.5 block">📎 {report.photoName}</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs text-slate-400 whitespace-nowrap">{formatDateTime(report.submittedAt)}</span>
                  </td>
                  <td className="px-5 py-4">
                    <ReportStatusBadge status={report.status} />
                  </td>
                  <td className="px-5 py-4">
                    {report.status === 'Pending' && (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleVerify(report.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 transition-colors text-xs font-medium whitespace-nowrap"
                        >
                          <CheckCircle size={12} />
                          Verifikasi
                        </button>
                        <button
                          onClick={() => handleReject(report.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-colors text-xs font-medium"
                        >
                          <XCircle size={12} />
                          Tolak
                        </button>
                      </div>
                    )}
                    {report.status !== 'Pending' && (
                      <div className="flex justify-end">
                        <span className="text-xs text-slate-500">—</span>
                      </div>
                    )}
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
