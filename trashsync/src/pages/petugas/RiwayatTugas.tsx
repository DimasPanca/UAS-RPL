import React, { useState, useEffect } from 'react';
import { History, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageSkeleton } from '../../components/UI/SkeletonCard';
import { FillBar } from '../../components/UI/FillBar';
import { formatDateTime } from '../../data/mockData';

export const RiwayatTugas: React.FC = () => {
  const { collectionHistory, currentUser } = useApp();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  // Show own history for petugas
  const history = currentUser?.role === 'petugas'
    ? collectionHistory.filter(c => c.petugasId === currentUser.id)
    : collectionHistory;

  if (loading) return <PageSkeleton />;

  return (
    <div className="space-y-5 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <History size={22} className="text-emerald-400" />
          Riwayat Tugas
        </h1>
        <p className="text-slate-400 text-sm mt-1">{history.length} pengangkutan tercatat</p>
      </div>

      {history.length === 0 ? (
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-12 text-center">
          <Trash2 size={36} className="text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">Belum ada riwayat pengangkutan</p>
        </div>
      ) : (
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/60">
                  {['Tempat Sampah', 'Level Sebelum', 'Waktu Selesai', 'Petugas', 'Catatan'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/40">
                {history.map(entry => (
                  <tr key={entry.id} className="hover:bg-slate-700/20 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-slate-700 flex items-center justify-center">
                          <Trash2 size={12} className="text-slate-300" />
                        </div>
                        <span className="text-sm font-medium text-slate-200 whitespace-nowrap">{entry.binName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 min-w-[140px]">
                      <div className="flex items-center gap-2">
                        <div className="w-20">
                          <FillBar percentage={entry.fillBefore} height="h-1.5" animated={false} />
                        </div>
                        <span className={`text-xs font-medium ${
                          entry.fillBefore >= 80 ? 'text-red-400' :
                          entry.fillBefore >= 50 ? 'text-amber-400' : 'text-emerald-400'
                        }`}>{entry.fillBefore}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs text-slate-300 whitespace-nowrap">{formatDateTime(entry.completedAt)}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                          {entry.petugasName.charAt(0)}
                        </div>
                        <span className="text-xs text-slate-300 whitespace-nowrap">{entry.petugasName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs text-slate-400">{entry.notes || '—'}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
