import React from 'react';
import { Trash2, LogOut, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

const roleLabel: Record<string, string> = {
  admin: 'Admin',
  petugas: 'Petugas',
  warga: 'Warga',
};

const roleBadgeClass: Record<string, string> = {
  admin: 'bg-violet-500/20 text-violet-400 border border-violet-500/30',
  petugas: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  warga: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
};

interface NavbarProps {
  onMenuToggle?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuToggle }) => {
  const { currentUser, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/60 flex items-center px-4 md:px-6 gap-4 sticky top-0 z-40">
      <button
        onClick={onMenuToggle}
        className="md:hidden p-2 rounded-lg text-slate-400 hover:bg-slate-700 transition-colors"
      >
        <Menu size={20} />
      </button>

      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
          <Trash2 size={16} className="text-emerald-400" />
        </div>
        <span className="font-bold text-slate-100 text-lg tracking-tight">TrashSync</span>
      </div>

      <div className="flex-1" />

      {currentUser && (
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-medium text-slate-200">{currentUser.name}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${roleBadgeClass[currentUser.role]}`}>
              {roleLabel[currentUser.role]}
            </span>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-semibold text-sm">
            {currentUser.name.charAt(0)}
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors text-sm"
          >
            <LogOut size={15} />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      )}
    </header>
  );
};
