import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, MapPin, Zap } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { TrashBin } from '../../types';
import { BinStatusBadge } from '../../components/UI/StatusBadge';
import { FillBar } from '../../components/UI/FillBar';
import { Modal, ConfirmDialog } from '../../components/UI/Modal';
import { PageSkeleton } from '../../components/UI/SkeletonCard';
import { formatDateTime } from '../../data/mockData';

const defaultForm = {
  name: '', location: '', coordinates: '', maxCapacity: 100, currentFill: 0
};

export const ManajemenBin: React.FC = () => {
  const { bins, addBin, updateBin, deleteBin, addToast } = useApp();
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBin, setEditingBin] = useState<TrashBin | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const openAdd = () => {
    setEditingBin(null);
    setForm(defaultForm);
    setShowModal(true);
  };

  const openEdit = (bin: TrashBin) => {
    setEditingBin(bin);
    setForm({
      name: bin.name, location: bin.location,
      coordinates: bin.coordinates, maxCapacity: bin.maxCapacity,
      currentFill: bin.currentFill,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.location) {
      addToast('error', 'Nama dan lokasi wajib diisi');
      return;
    }
    const payload = {
      name: form.name,
      location: form.location,
      coordinates: form.coordinates,
      maxCapacity: Number(form.maxCapacity),
      currentFill: Number(form.currentFill),
    };
    try {
      if (editingBin) {
        await updateBin(editingBin.id, payload);
        addToast('success', 'Tempat sampah berhasil diperbarui');
      } else {
        await addBin(payload);
        addToast('success', 'Tempat sampah baru berhasil ditambahkan');
      }
      setShowModal(false);
    } catch (err: any) {
      addToast('error', err.message || 'Gagal menyimpan data');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBin(id);
      addToast('success', 'Tempat sampah berhasil dihapus');
    } catch (err: any) {
      addToast('error', err.message || 'Gagal menghapus data');
    }
  };

  if (loading) return <PageSkeleton />;

  return (
    <div className="space-y-5 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Manajemen Tempat Sampah</h1>
          <p className="text-slate-400 text-sm mt-1">{bins.length} unit terdaftar</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-emerald-500/20"
        >
          <Plus size={16} />
          Tambah Bin
        </button>
      </div>

      <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/60">
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">ID</th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">Nama & Lokasi</th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">Koordinat</th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">Level Isi</th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">Status</th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">Terakhir Update</th>
                <th className="text-right text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/40">
              {bins.map(bin => (
                <tr key={bin.id} className="hover:bg-slate-700/20 transition-colors">
                  <td className="px-5 py-4">
                    <span className="text-xs text-slate-500 font-mono">{bin.id}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center">
                        <Trash2 size={14} className="text-slate-300" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-200">{bin.name}</p>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <MapPin size={10} />
                          {bin.location}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs text-slate-400 font-mono">{bin.coordinates}</span>
                  </td>
                  <td className="px-5 py-4 min-w-[140px]">
                    <FillBar percentage={bin.currentFill} height="h-2" showLabel />
                  </td>
                  <td className="px-5 py-4">
                    <BinStatusBadge status={bin.status} />
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs text-slate-400">{formatDateTime(bin.lastUpdated)}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(bin)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteId(bin.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingBin ? 'Edit Tempat Sampah' : 'Tambah Tempat Sampah'}
      >
        <div className="space-y-4">
          {[
            { label: 'Nama Lokasi', key: 'name', placeholder: 'Gerbang Utama' },
            { label: 'Deskripsi Lokasi', key: 'location', placeholder: 'Area pintu masuk utama' },
            { label: 'Koordinat GPS', key: 'coordinates', placeholder: '-6.2088, 106.8456' },
          ].map(({ label, key, placeholder }) => (
            <div key={key}>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">{label}</label>
              <input
                type="text"
                value={(form as Record<string, string | number>)[key] as string}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                placeholder={placeholder}
                className="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600/60 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
              />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block flex items-center gap-1">
                <Zap size={11} /> Level Isi Saat Ini (%)
              </label>
              <input
                type="number" min="0" max="100"
                value={form.currentFill}
                onChange={e => setForm(f => ({ ...f, currentFill: Number(e.target.value) }))}
                className="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600/60 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-emerald-500/50 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">Kapasitas Maks (L)</label>
              <input
                type="number"
                value={form.maxCapacity}
                onChange={e => setForm(f => ({ ...f, maxCapacity: Number(e.target.value) }))}
                className="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600/60 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-emerald-500/50 transition-colors"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setShowModal(false)}
              className="flex-1 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm font-medium transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium transition-colors"
            >
              Simpan
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && handleDelete(deleteId)}
        title="Hapus Tempat Sampah"
        message="Yakin ingin menghapus tempat sampah ini? Tindakan ini tidak dapat dibatalkan."
        confirmLabel="Ya, Hapus"
      />
    </div>
  );
};
