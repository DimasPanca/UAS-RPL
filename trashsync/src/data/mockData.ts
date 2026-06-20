import type { TrashBin, User, Report, CollectionHistory, SensorReading } from '../types';

export const MOCK_BINS: TrashBin[] = [
  {
    id: 'bin-001',
    name: 'Gerbang Utama',
    location: 'Pintu Masuk Utama',
    coordinates: '-6.2088, 106.8456',
    maxCapacity: 100,
    currentFill: 85,
    lastUpdated: '2026-06-08T08:30:00',
    status: 'penuh',
  },
  {
    id: 'bin-002',
    name: 'Taman Bermain',
    location: 'Area Rekreasi Anak',
    coordinates: '-6.2091, 106.8461',
    maxCapacity: 100,
    currentFill: 42,
    lastUpdated: '2026-06-08T08:28:00',
    status: 'aman',
  },
  {
    id: 'bin-003',
    name: 'Lapangan Olahraga',
    location: 'Area Fasilitas Olahraga',
    coordinates: '-6.2095, 106.8458',
    maxCapacity: 100,
    currentFill: 67,
    lastUpdated: '2026-06-08T08:25:00',
    status: 'waspada',
  },
  {
    id: 'bin-004',
    name: 'Sudut Blok Timur',
    location: 'Blok Timur, Jl. Mawar No. 12',
    coordinates: '-6.2085, 106.8470',
    maxCapacity: 100,
    currentFill: 23,
    lastUpdated: '2026-06-08T08:22:00',
    status: 'aman',
  },
  {
    id: 'bin-005',
    name: 'Sudut Blok Barat',
    location: 'Blok Barat, Jl. Melati No. 5',
    coordinates: '-6.2092, 106.8445',
    maxCapacity: 100,
    currentFill: 91,
    lastUpdated: '2026-06-08T08:20:00',
    status: 'penuh',
  },
];

export const MOCK_USERS: User[] = [
  {
    id: 'user-001',
    name: 'Ahmad Fauzi',
    email: 'admin@trashsync.id',
    role: 'admin',
    status: 'Aktif',
    password: 'admin123',
  },
  {
    id: 'user-002',
    name: 'Budi Santoso',
    email: 'budi@trashsync.id',
    role: 'petugas',
    status: 'Aktif',
    password: 'petugas123',
  },
  {
    id: 'user-003',
    name: 'Cahyo Pratama',
    email: 'cahyo@trashsync.id',
    role: 'petugas',
    status: 'Aktif',
    password: 'petugas123',
  },
  {
    id: 'user-004',
    name: 'Dewi Rahayu',
    email: 'dewi@trashsync.id',
    role: 'warga',
    status: 'Aktif',
    password: 'warga123',
  },
  {
    id: 'user-005',
    name: 'Eko Setiawan',
    email: 'eko@trashsync.id',
    role: 'warga',
    status: 'Aktif',
    password: 'warga123',
  },
  {
    id: 'user-006',
    name: 'Fitri Handayani',
    email: 'fitri@trashsync.id',
    role: 'warga',
    status: 'Aktif',
    password: 'warga123',
  },
  {
    id: 'user-007',
    name: 'Gunawan Wibowo',
    email: 'gunawan@trashsync.id',
    role: 'warga',
    status: 'Nonaktif',
    password: 'warga123',
  },
];

export const MOCK_REPORTS: Report[] = [
  {
    id: 'rep-001',
    reporterId: 'user-004',
    reporterName: 'Dewi Rahayu',
    binId: 'bin-001',
    binName: 'Gerbang Utama',
    category: 'Penuh',
    description: 'Tempat sampah sudah sangat penuh dan mulai meluber ke jalan.',
    submittedAt: '2026-06-08T07:15:00',
    status: 'Pending',
  },
  {
    id: 'rep-002',
    reporterId: 'user-005',
    reporterName: 'Eko Setiawan',
    binId: 'bin-005',
    binName: 'Sudut Blok Barat',
    category: 'Bau',
    description: 'Bau tidak sedap sangat menyengat sejak kemarin sore. Mohon segera diangkut.',
    submittedAt: '2026-06-08T06:45:00',
    status: 'Terverifikasi',
  },
  {
    id: 'rep-003',
    reporterId: 'user-006',
    reporterName: 'Fitri Handayani',
    binId: 'bin-003',
    binName: 'Lapangan Olahraga',
    category: 'Rusak',
    description: 'Tutup tempat sampah rusak, sampah berserakan terkena angin.',
    photoName: 'foto_kerusakan.jpg',
    submittedAt: '2026-06-07T16:30:00',
    status: 'Terverifikasi',
  },
  {
    id: 'rep-004',
    reporterId: 'user-004',
    reporterName: 'Dewi Rahayu',
    binId: 'bin-002',
    binName: 'Taman Bermain',
    category: 'Lainnya',
    description: 'Ada sampah plastik besar yang tidak masuk ke dalam tempat sampah.',
    submittedAt: '2026-06-07T10:00:00',
    status: 'Ditolak',
  },
  {
    id: 'rep-005',
    reporterId: 'user-005',
    reporterName: 'Eko Setiawan',
    binId: 'bin-004',
    binName: 'Sudut Blok Timur',
    category: 'Penuh',
    description: 'Tempat sampah hampir penuh, perlu segera diangkut sebelum penuh.',
    submittedAt: '2026-06-06T14:20:00',
    status: 'Terverifikasi',
  },
];

export const MOCK_COLLECTION_HISTORY: CollectionHistory[] = [
  {
    id: 'col-001',
    binId: 'bin-001',
    binName: 'Gerbang Utama',
    completedAt: '2026-06-07T09:30:00',
    petugasId: 'user-002',
    petugasName: 'Budi Santoso',
    notes: 'Pengangkutan rutin pagi',
    fillBefore: 92,
  },
  {
    id: 'col-002',
    binId: 'bin-005',
    binName: 'Sudut Blok Barat',
    completedAt: '2026-06-07T10:15:00',
    petugasId: 'user-003',
    petugasName: 'Cahyo Pratama',
    notes: 'Menindaklanjuti laporan warga',
    fillBefore: 88,
  },
  {
    id: 'col-003',
    binId: 'bin-003',
    binName: 'Lapangan Olahraga',
    completedAt: '2026-06-06T14:00:00',
    petugasId: 'user-002',
    petugasName: 'Budi Santoso',
    fillBefore: 75,
  },
  {
    id: 'col-004',
    binId: 'bin-002',
    binName: 'Taman Bermain',
    completedAt: '2026-06-06T15:30:00',
    petugasId: 'user-003',
    petugasName: 'Cahyo Pratama',
    notes: 'Sudah koordinasi dengan RT',
    fillBefore: 82,
  },
  {
    id: 'col-005',
    binId: 'bin-004',
    binName: 'Sudut Blok Timur',
    completedAt: '2026-06-05T09:00:00',
    petugasId: 'user-002',
    petugasName: 'Budi Santoso',
    fillBefore: 68,
  },
  {
    id: 'col-006',
    binId: 'bin-001',
    binName: 'Gerbang Utama',
    completedAt: '2026-06-05T11:00:00',
    petugasId: 'user-003',
    petugasName: 'Cahyo Pratama',
    notes: 'Pengangkutan darurat',
    fillBefore: 95,
  },
];

export const MOCK_SENSOR_HISTORY: SensorReading[] = [
  {
    date: '2026-06-02',
    fills: { 'bin-001': 45, 'bin-002': 30, 'bin-003': 25, 'bin-004': 18, 'bin-005': 40 },
  },
  {
    date: '2026-06-03',
    fills: { 'bin-001': 58, 'bin-002': 38, 'bin-003': 40, 'bin-004': 22, 'bin-005': 55 },
  },
  {
    date: '2026-06-04',
    fills: { 'bin-001': 72, 'bin-002': 42, 'bin-003': 52, 'bin-004': 25, 'bin-005': 70 },
  },
  {
    date: '2026-06-05',
    fills: { 'bin-001': 95, 'bin-002': 50, 'bin-003': 60, 'bin-004': 30, 'bin-005': 88 },
  },
  {
    date: '2026-06-06',
    fills: { 'bin-001': 32, 'bin-002': 55, 'bin-003': 75, 'bin-004': 35, 'bin-005': 25 },
  },
  {
    date: '2026-06-07',
    fills: { 'bin-001': 18, 'bin-002': 38, 'bin-003': 55, 'bin-004': 20, 'bin-005': 15 },
  },
  {
    date: '2026-06-08',
    fills: { 'bin-001': 85, 'bin-002': 42, 'bin-003': 67, 'bin-004': 23, 'bin-005': 91 },
  },
];

export const getBinStatus = (fill: number): 'aman' | 'waspada' | 'penuh' => {
  if (fill < 50) return 'aman';
  if (fill < 80) return 'waspada';
  return 'penuh';
};

export const formatDateTime = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

export const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
};
