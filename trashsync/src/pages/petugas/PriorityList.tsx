import React, { useState, useEffect } from 'react';
import { CheckCircle2, Trash2, ArrowUpDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BinStatusBadge } from '../../components/UI/StatusBadge';
import { FillBar } from '../../components/UI/FillBar';
import { PageSkeleton } from '../../components/UI/SkeletonCard';

export const PriorityList: React.FC = () => {
  const { bins, currentUser, markBinCollected, addToast } = useApp();
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const sorted = [...bins].sort((a, b) => b.currentFill - a.currentFill);

  const handleComplete = async (binId: string) => {
    setCompleting(binId);
    await new Promise(r => setTimeout(r, 600));
    markBinCollected(binId, currentUser!.id, currentUser!.name);
    setCompleting(null);
    addToast('success', 'Pengangkutan berhasil dicatat!');
  };

  const greeting = new Date().getHours() < 12 ? 'Selamat Pagi' :
    new Date().getHours() < 17 ? 'Selamat Siang' : 'Selamat Malam';

  if (loading) return <PageSkeleton />;

  const urgent = sorted.filter(b => b.currentFill >= 80).length;

  return (
    <div className="space-y-5 animate-fadeIn">
      <div className="bg-gradient-to-r from-slate-800/80 to-slate-800/40 border border-slate-700/50 rounded-2xl p-5">
        <h1 className="text-xl font-bold text-slate-100">
          {greeting}, {currentUser?.name?.split(' ')[0]}!
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Tugas Hari Ini: <span className="text-emerald-400 font-semibold">{sorted.length} tempat sampah</span>
          {urgent > 0 && (
            <span className="ml-2 text-red-400">
              ({urgent} perlu segera diangkut)
            </span>
          )}
        </p>
      </div>

      <div className="flex items-center gap-2 text-xs text-slate-400">
        <ArrowUpDown size={12} />
        Diurutkan berdasarkan prioritas (level isi tertinggi)
      </div>

      <div className="space-y-3">
        {sorted.map((bin, index) => (
          <div
            key={bin.id}
            className={`bg-slate-800/60 border rounded-2xl p-5 transition-all duration-300 ${
              bin.currentFill === 0
                ? 'border-emerald-500/20 bg-emerald-500/5'
                : bin.currentFill >= 80
                ? 'border-red-500/30 bg-red-500/5'
                : 'border-slate-700/50'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm ${
                  index === 0 && bin.currentFill > 0 ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : 'bg-slate-700 text-slate-400'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-slate-200">{bin.name}</h3>
                    <BinStatusBadge status={bin.status} />
                  </div>
                  <p className="text-xs text-slate-500 mb-3">{bin.location}</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <FillBar percentage={bin.currentFill} height="h-2.5" />
                    </div>
                    <span className={`text-base font-bold shrink-0 ${
                      bin.currentFill >= 80 ? 'text-red-400' :
                      bin.currentFill >= 50 ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {bin.currentFill}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="shrink-0">
                {bin.currentFill === 0 ? (
                  <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
                    <CheckCircle2 size={14} />
                    Selesai
                  </div>
                ) : (
                  <button
                    onClick={() => handleComplete(bin.id)}
                    disabled={completing === bin.id}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      bin.currentFill >= 80
                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                        : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                    } disabled:opacity-60`}
                  >
                    {completing === bin.id ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Trash2 size={14} />
                    )}
                    Tandai Selesai
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
