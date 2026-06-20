import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Trash2, Users, FileText, BarChart2,
  ListChecks, History, MapPin, PlusCircle, LogOut, X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface NavItem {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const adminNav: NavItem[] = [
  { to: '/admin', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
  { to: '/admin/bins', icon: <Trash2 size={18} />, label: 'Tempat Sampah' },
  { to: '/admin/users', icon: <Users size={18} />, label: 'Pengguna' },
  { to: '/admin/reports', icon: <FileText size={18} />, label: 'Laporan Warga' },
  { to: '/admin/recap', icon: <BarChart2 size={18} />, label: 'Rekap Bulanan' },
];

const petugasNav: NavItem[] = [
  { to: '/petugas', icon: <ListChecks size={18} />, label: 'Prioritas Hari Ini' },
  { to: '/petugas/history', icon: <History size={18} />, label: 'Riwayat Tugas' },
];

const wargaNav: NavItem[] = [
  { to: '/warga', icon: <MapPin size={18} />, label: 'Kondisi Tempat Sampah' },
  { to: '/warga/report', icon: <PlusCircle size={18} />, label: 'Buat Laporan' },
  { to: '/warga/history', icon: <History size={18} />, label: 'Riwayat Laporan' },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { currentUser, logout } = useApp();
  const navigate = useNavigate();

  const navItems =
    currentUser?.role === 'admin' ? adminNav :
    currentUser?.role === 'petugas' ? petugasNav :
    wargaNav;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed md:sticky top-0 md:top-16 h-screen md:h-[calc(100vh-4rem)]
        w-64 bg-slate-900 border-r border-slate-700/60
        flex flex-col z-40 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-slate-700/60">
          <span className="text-sm font-medium text-slate-300">Menu</span>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-700 transition-colors">
            <X size={16} />
          </button>
        </div>

        <nav className="flex-1 py-4 px-3 overflow-y-auto">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">
            {currentUser?.role === 'admin' ? 'Manajemen' : currentUser?.role === 'petugas' ? 'Tugas' : 'Menu'}
          </p>
          <ul className="space-y-1">
            {navItems.map(item => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/admin' || item.to === '/petugas' || item.to === '/warga'}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`
                  }
                >
                  {item.icon}
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-3 border-t border-slate-700/60">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={18} />
            Keluar
          </button>
        </div>
      </aside>
    </>
  );
};
