import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Send, Paperclip, ChevronDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { ReportCategory } from '../../types';

export const BuatLaporan: React.FC = () => {
  const { bins, currentUser, addReport, addToast } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const preselectedBin = (location.state as { binId?: string; binName?: string } | null);

  const [form, setForm] = useState({
    binId: preselectedBin?.binId || '',
    category: '' as ReportCategory | '',
    description: '',
    photoName: '',
  });

  const categories: ReportCategory[] = ['Penuh', 'Rusak', 'Bau', 'Lainnya'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.binId || !form.category || !form.description.trim()) {
      addToast('error', 'Semua field wajib diisi');
      return;
    }
    const bin = bins.find(b => b.id === form.binId);
    addReport({
      reporterId: currentUser!.id,
      reporterName: currentUser!.name,
      binId: form.binId,
      binName: bin?.name || '',
      category: form.category as ReportCategory,
      description: form.description.trim(),
      photoName: form.photoName || undefined,
    });
    addToast('success', 'Laporan berhasil dikirim! Terima kasih atas partisipasi Anda.');
    navigate('/warga/history');
  };

  return (
    <div className="space-y-5 animate-fadeIn max-w-xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Buat Laporan</h1>
        <p className="text-slate-400 text-sm mt-1">Laporkan kondisi tempat sampah di kawasan</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 space-y-5">
        {/* Bin selector */}
        <div>
          <label className="text-sm font-medium text-slate-300 mb-2 block">
            Pilih Tempat Sampah <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <select
              value={form.binId}
              onChange={e => setForm(f => ({ ...f, binId: e.target.value }))}
              className="w-full appearance-none px-4 py-3 bg-slate-700/50 border border-slate-600/60 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-emerald-500/50 transition-colors"
            >
              <option value="" className="bg-slate-800">-- Pilih lokasi tempat sampah --</option>
              {bins.map(b => (
                <option key={b.id} value={b.id} className="bg-slate-800">
                  {b.name} ({b.currentFill}% penuh)
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="text-sm font-medium text-slate-300 mb-2 block">
            Kategori Masalah <span className="text-red-400">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setForm(f => ({ ...f, category: cat }))}
                className={`py-2.5 rounded-xl text-sm font-medium transition-all border ${
                  form.category === cat
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    : 'bg-slate-700/40 text-slate-400 border-slate-600/50 hover:border-slate-500'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="text-sm font-medium text-slate-300 mb-2 block">
            Deskripsi <span className="text-red-400">*</span>
          </label>
          <textarea
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            rows={4}
            placeholder="Ceritakan kondisi tempat sampah secara detail..."
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/60 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-colors resize-none"
          />
          <p className="text-xs text-slate-500 mt-1">{form.description.length}/500 karakter</p>
        </div>

        {/* Photo upload (mock) */}
        <div>
          <label className="text-sm font-medium text-slate-300 mb-2 block">
            Upload Foto (opsional)
          </label>
          <label className="flex items-center gap-3 px-4 py-3 bg-slate-700/40 border border-dashed border-slate-600/60 rounded-xl cursor-pointer hover:border-emerald-500/40 transition-colors group">
            <Paperclip size={16} className="text-slate-400 group-hover:text-emerald-400 transition-colors" />
            <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
              {form.photoName || 'Klik untuk pilih foto'}
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => setForm(f => ({ ...f, photoName: e.target.files?.[0]?.name || '' }))}
            />
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm transition-colors shadow-lg shadow-emerald-500/20"
        >
          <Send size={16} />
          Kirim Laporan
        </button>
      </form>
    </div>
  );
};
