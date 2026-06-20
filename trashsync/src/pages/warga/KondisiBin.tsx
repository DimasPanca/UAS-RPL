import React, { useState, useEffect } from 'react';
import { MapPin, AlertTriangle, Flag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { BinStatusBadge } from '../../components/UI/StatusBadge';
import { CircularGauge, FillBar } from '../../components/UI/FillBar';
import { PageSkeleton } from '../../components/UI/SkeletonCard';

export const KondisiBin: React.FC = () => {
  const { bins } = useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const penuh = bins.filter(b => b.status === 'penuh').length;

  if (loading) return <PageSkeleton />;

  return (
    <div className="space-y-5 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Kondisi Tempat Sampah</h1>
        <p className="text-slate-400 text-sm mt-1">Pantau status 5 tempat sampah di kawasan</p>
      </div>

      {penuh > 0 && (
        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-400">
          <AlertTriangle size={16} />
          {penuh} tempat sampah penuh, harap laporkan jika petugas belum datang
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {bins.map(bin => (
          <div
            key={bin.id}
            className={`bg-slate-800/60 border rounded-2xl p-5 hover:border-slate-600 transition-all duration-200 ${
              bin.status === 'penuh'
                ? 'border-red-500/30'
                : bin.status === 'waspada'
                ? 'border-amber-500/30'
                : 'border-slate-700/50'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-slate-200">{bin.name}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin size={10} />
                  {bin.location}
                </p>
              </div>
              <BinStatusBadge status={bin.status} />
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <p className="text-xs text-slate-400 mb-2">Level Pengisian</p>
                <FillBar percentage={bin.currentFill} height="h-3" />
                <p className="text-xs text-slate-500 mt-1">
                  {bin.currentFill < 50
                    ? 'Masih aman, kapasitas tersisa banyak'
                    : bin.currentFill < 80
                    ? 'Mulai penuh, perlu diperhatikan'
                    : 'Segera laporkan ke petugas!'}
                </p>
              </div>
              <div className="ml-4">
                <CircularGauge percentage={bin.currentFill} size={70} />
              </div>
            </div>

            <button
              onClick={() => navigate('/warga/report', { state: { binId: bin.id, binName: bin.name } })}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                bin.status === 'penuh'
                  ? 'bg-red-500/15 text-red-400 hover:bg-red-500/25 border border-red-500/25'
                  : 'bg-slate-700/60 text-slate-300 hover:bg-slate-700 border border-slate-600/50'
              }`}
            >
              <Flag size={14} />
              Laporkan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
