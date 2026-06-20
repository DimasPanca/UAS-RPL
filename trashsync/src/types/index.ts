export type UserRole = 'admin' | 'petugas' | 'warga';

export type BinStatus = 'aman' | 'waspada' | 'penuh';

export type ReportCategory = 'Penuh' | 'Rusak' | 'Bau' | 'Lainnya';

export type ReportStatus = 'Pending' | 'Terverifikasi' | 'Ditolak';

export type UserStatus = 'Aktif' | 'Nonaktif';

export interface TrashBin {
  id: string;
  name: string;
  location: string;
  coordinates: string;
  maxCapacity: number;
  currentFill: number;
  lastUpdated: string;
  status: BinStatus;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  password: string;
  avatar?: string;
}

export interface Report {
  id: string;
  reporterId: string;
  reporterName: string;
  binId: string;
  binName: string;
  category: ReportCategory;
  description: string;
  photoName?: string;
  submittedAt: string;
  status: ReportStatus;
}

export interface CollectionHistory {
  id: string;
  binId: string;
  binName: string;
  completedAt: string;
  petugasId: string;
  petugasName: string;
  notes?: string;
  fillBefore: number;
}

export interface SensorReading {
  date: string;
  fills: Record<string, number>;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}
