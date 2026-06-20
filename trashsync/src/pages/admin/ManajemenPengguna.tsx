import React, { useState, useEffect } from 'react';
import { Plus, Edit2, UserX, UserCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { User, UserRole, UserStatus } from '../../types';

import { UserStatusBadge } from '../../components/UI/StatusBadge';
import { Modal, ConfirmDialog } from '../../components/UI/Modal';
import { PageSkeleton } from '../../components/UI/SkeletonCard';

type TabRole = 'petugas' | 'warga';

const defaultForm = { name: '', email: '', role: 'warga' as UserRole, status: 'Aktif' as UserStatus, password: '' };

export const ManajemenPengguna: React.FC = () => {
  const { users, addUser, editUser, toggleUserStatus, addToast } = useApp();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabRole>('petugas');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deactivateId, setDeactivateId] = useState<string | null>(null);
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const filtered = users.filter(u => u.role === activeTab);

  const openAdd = () => {
    setEditingUser(null);
    setForm({ ...defaultForm, role: activeTab });
    setShowModal(true);
  };

  const openEdit = (user: User) => {
    setEditingUser(user);
    setForm({ name: user.name, email: user.email, role: user.role, status: user.status, password: '' });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.email) {
      addToast('error', 'Nama dan email wajib diisi');
      return;
    }
    try {
      if (editingUser) {
        await editUser(editingUser.id, {
          name: form.name,
          email: form.email,
          role: form.role,
          status: form.status,
          password: form.password || editingUser.password,
        });
        addToast('success', 'Data pengguna berhasil diperbarui');
      } else {
        if (!form.password) {
          addToast('error', 'Password wajib diisi untuk pengguna baru');
          return;
        }
        await addUser({
          name: form.name,
          email: form.email,
          role: form.role,
          status: form.status,
          password: form.password,
        });
        addToast('success', 'Pengguna baru berhasil ditambahkan');
      }
      setShowModal(false);
    } catch (err: any) {
      addToast('error', err.message || 'Gagal menyimpan data');
    }
  };

  const handleToggleStatus = async (id: string, current: UserStatus) => {
    try {
      await toggleUserStatus(id, current);
      const next = current === 'Aktif' ? 'Nonaktif' : 'Aktif';
      addToast('info', `Status pengguna diubah menjadi ${next}`);
    } catch (err: any) {
      addToast('error', err.message || 'Gagal mengubah status');
    }
  };

  const tabCounts = {
    petugas: users.filter(u => u.role === 'petugas').length,
    warga: users.filter(u => u.role === 'warga').length,
  };

  if (loading) return <PageSkeleton />;

  return (
    <div className="space-y-5 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Manajemen Pengguna</h1>
          <p className="text-slate-400 text-sm mt-1">{users.filter(u => u.role !== 'admin').length} pengguna terdaftar</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-emerald-500/20"
        >
          <Plus size={16} />
          Tambah Pengguna
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-800/60 border border-slate-700/50 rounded-xl p-1 w-fit">
        {(['petugas', 'warga'] as TabRole[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
              activeTab === tab
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab === 'petugas' ? 'Petugas' : 'Warga'}
            <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
              activeTab === tab ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-500'
            }`}>{tabCounts[tab]}</span>
          </button>
        ))}
      </div>

      <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/60">
                {['Nama', 'Email', 'Role', 'Status', 'Aksi'].map(h => (
                  <th key={h} className={`text-${h === 'Aksi' ? 'right' : 'left'} text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/40">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-slate-500 py-8 text-sm">
                    Belum ada pengguna {activeTab}
                  </td>
                </tr>
              ) : filtered.map(user => (
                <tr key={user.id} className="hover:bg-slate-700/20 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-sm font-semibold">
                        {user.name.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-slate-200">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-slate-400">{user.email}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs text-slate-300 capitalize">{user.role}</span>
                  </td>
                  <td className="px-5 py-4">
                    <UserStatusBadge status={user.status} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(user)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => { setDeactivateId(user.id); }}
                        className={`p-1.5 rounded-lg transition-colors ${
                          user.status === 'Aktif'
                            ? 'text-slate-400 hover:text-red-400 hover:bg-red-500/10'
                            : 'text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10'
                        }`}
                      >
                        {user.status === 'Aktif' ? <UserX size={14} /> : <UserCheck size={14} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingUser ? 'Edit Pengguna' : 'Tambah Pengguna'}
      >
        <div className="space-y-4">
          {[
            { label: 'Nama Lengkap', key: 'name', placeholder: 'Ahmad Fauzi', type: 'text' },
            { label: 'Email', key: 'email', placeholder: 'email@trashsync.id', type: 'email' },
            { label: 'Password', key: 'password', placeholder: editingUser ? '(kosongkan jika tidak diubah)' : 'password123', type: 'password' },
          ].map(({ label, key, placeholder, type }) => (
            <div key={key}>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">{label}</label>
              <input
                type={type}
                value={(form as Record<string, string>)[key]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                placeholder={placeholder}
                className="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600/60 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
              />
            </div>
          ))}
          <div>
            <label className="text-xs font-medium text-slate-400 mb-1.5 block">Role</label>
            <select
              value={form.role}
              onChange={e => setForm(f => ({ ...f, role: e.target.value as UserRole }))}
              className="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600/60 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-emerald-500/50 transition-colors"
            >
              <option value="petugas">Petugas</option>
              <option value="warga">Warga</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm font-medium transition-colors">
              Batal
            </button>
            <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium transition-colors">
              Simpan
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deactivateId}
        onClose={() => setDeactivateId(null)}
        onConfirm={() => {
          if (!deactivateId) return;
          const user = users.find(u => u.id === deactivateId);
          if (user) handleToggleStatus(user.id, user.status);
        }}
        title="Ubah Status Pengguna"
        message="Yakin ingin mengubah status pengguna ini?"
        confirmLabel="Konfirmasi"
        variant="warning"
      />
    </div>
  );
};
