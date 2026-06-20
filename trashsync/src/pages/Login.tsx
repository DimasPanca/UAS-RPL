import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ShieldCheck, HardHat, Home, Mail, Lock, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { UserRole } from '../types';

const roles: { role: UserRole; label: string; desc: string; icon: React.ReactNode; color: string }[] = [
  {
    role: 'admin',
    label: 'Admin',
    desc: 'Pengurus Kawasan',
    icon: <ShieldCheck size={22} />,
    color: 'violet',
  },
  {
    role: 'petugas',
    label: 'Petugas',
    desc: 'Tim Kebersihan',
    icon: <HardHat size={22} />,
    color: 'blue',
  },
  {
    role: 'warga',
    label: 'Warga',
    desc: 'Penghuni Kawasan',
    icon: <Home size={22} />,
    color: 'emerald',
  },
];

const colorMap: Record<string, { card: string; active: string }> = {
  violet: {
    card: 'border-violet-500/30 hover:border-violet-500/60 hover:bg-violet-500/10',
    active: 'border-violet-500 bg-violet-500/15 ring-2 ring-violet-500/30',
  },
  blue: {
    card: 'border-blue-500/30 hover:border-blue-500/60 hover:bg-blue-500/10',
    active: 'border-blue-500 bg-blue-500/15 ring-2 ring-blue-500/30',
  },
  emerald: {
    card: 'border-emerald-500/30 hover:border-emerald-500/60 hover:bg-emerald-500/10',
    active: 'border-emerald-500 bg-emerald-500/15 ring-2 ring-emerald-500/30',
  },
};

const iconColorMap: Record<string, string> = {
  violet: 'text-violet-400 bg-violet-500/20',
  blue: 'text-blue-400 bg-blue-500/20',
  emerald: 'text-emerald-400 bg-emerald-500/20',
};

export const Login: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useApp();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Email dan password wajib diisi');
      return;
    }
    setError('');
    setLoading(true);
    const user = await login(email, password);
    setLoading(false);
    if (!user) {
      setError('Email atau password salah, atau akun tidak aktif');
      return;
    }
    navigate(`/${user.role}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-500/3 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-fadeIn">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 mb-4">
            <Trash2 size={28} className="text-emerald-400" />
          </div>
          <h1 className="text-3xl font-bold text-slate-100 tracking-tight">TrashSync</h1>
          <p className="text-slate-400 text-sm mt-2 leading-relaxed">
            Sistem Monitoring Sampah Pintar<br />Kawasan Perumahan
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/60 rounded-2xl p-6 shadow-2xl">
          <h2 className="text-base font-semibold text-slate-200 mb-4">Masuk sebagai</h2>

          {/* Role Selector */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {roles.map(({ role, label, desc, icon, color }) => {
              const isActive = selectedRole === role;
              return (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-200 ${
                    isActive ? colorMap[color].active : `border-slate-700/60 bg-slate-800/40 ${colorMap[color].card}`
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconColorMap[color]}`}>
                    {icon}
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-semibold text-slate-200">{label}</p>
                    <p className="text-[10px] text-slate-500 leading-tight">{desc}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="nama@trashsync.id"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-700/50 border border-slate-600/60 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-700/50 border border-slate-600/60 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition-colors"
                />
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-emerald-500/20 disabled:shadow-none"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Masuk<ArrowRight size={16} /></>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          TrashSync v1.0 · IoT Smart Waste Monitoring System
        </p>
      </div>
    </div>
  );
};
