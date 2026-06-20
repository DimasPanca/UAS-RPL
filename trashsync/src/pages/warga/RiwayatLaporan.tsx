import React, { useState, useEffect } from 'react';
import { FileText, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ReportStatusBadge } from '../../components/UI/StatusBadge';
import { PageSkeleton } from '../../components/UI/SkeletonCard';
import { formatDateTime } from '../../data/mockData';

const categoryColor: Record<string, string> = {
  Penuh: 'bg-red-500/15 text-red-400',
  Rusak: 'bg-orange-500/15 text-orange-400',
  Bau: 'bg-yellow-500/15 text-yellow-400',
  Lainnya: 'bg-slate-500/15 text-slate-400',
};

export const RiwayatLaporan: React.FC = () => {
  const { reports, currentUser } = useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const myReports = reports.filter(r => r.reporterId === currentUser?.id);

  if (loading) return <PageSkeleton />;

  return (
    <div className="space-y-5 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Riwayat Laporan</h1>
          <p className="text-slate-400 text-sm mt-1">{myReports.length} laporan yang pernah dibuat</p>
        </div>
        <button
          onClick={() => navigate('/warga/report')}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-emerald-500/20"
        >
          <Plus size={16} />
          Buat Laporan
        </button>
      </div>

      {myReports.length === 0 ? (
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-12 text-center">
          <FileText size={36} className="text-slate-600 mx-auto mb-3" />
          <p className="text-slate-300 font-medium mb-1">Belum ada laporan</p>
          <p className="text-slate-500 text-sm mb-4">Bantu jaga kebersihan kawasan dengan melaporkan masalah</p>
          <button
            onClick={() => navigate('/warga/report')}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-medium transition-colors"
          >
            Buat Laporan Pertama
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {myReports.map(report => (
            <div
              key={report.id}
              className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5 hover:border-slate-600 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-slate-700/60 flex items-center justify-center shrink-0">
                    <FileText size={16} className="text-slate-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="text-sm font-semibold text-slate-200">{report.binName}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-lg font-medium ${categoryColor[report.category]}`}>
                        {report.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mb-2 line-clamp-2">{report.description}</p>
                    {report.photoName && (
                      <p className="text-[10px] text-blue-400 mb-1">📎 {report.photoName}</p>
                    )}
                    <p className="text-[11px] text-slate-500">{formatDateTime(report.submittedAt)}</p>
                  </div>
                </div>
                <ReportStatusBadge status={report.status} />
              </div>

              {report.status === 'Ditolak' && (
                <div className="mt-3 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400">
                  Laporan ini tidak dapat diproses. Silakan hubungi pengurus kawasan untuk informasi lebih lanjut.
                </div>
              )}
              {report.status === 'Terverifikasi' && (
                <div className="mt-3 px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs text-emerald-400">
                  Laporan Anda telah diverifikasi dan sedang dalam proses penanganan.
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
