import React from 'react';
import type { BinStatus, ReportStatus, UserStatus } from '../../types';

interface BinStatusBadgeProps {
  status: BinStatus;
}

export const BinStatusBadge: React.FC<BinStatusBadgeProps> = ({ status }) => {
  const config = {
    aman: { label: 'Aman', className: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' },
    waspada: { label: 'Waspada', className: 'bg-amber-500/20 text-amber-400 border border-amber-500/30' },
    penuh: { label: 'Penuh', className: 'bg-red-500/20 text-red-400 border border-red-500/30' },
  };
  const { label, className } = config[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
        status === 'aman' ? 'bg-emerald-400' : status === 'waspada' ? 'bg-amber-400' : 'bg-red-400'
      }`} />
      {label}
    </span>
  );
};

interface ReportStatusBadgeProps {
  status: ReportStatus;
}

export const ReportStatusBadge: React.FC<ReportStatusBadgeProps> = ({ status }) => {
  const config = {
    Pending: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    Terverifikasi: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    Ditolak: 'bg-red-500/20 text-red-400 border border-red-500/30',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config[status]}`}>
      {status}
    </span>
  );
};

interface UserStatusBadgeProps {
  status: UserStatus;
}

export const UserStatusBadge: React.FC<UserStatusBadgeProps> = ({ status }) => {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      status === 'Aktif'
        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
        : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
    }`}>
      {status}
    </span>
  );
};
