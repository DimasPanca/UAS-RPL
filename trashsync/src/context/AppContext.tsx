import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type {
  TrashBin, User, Report, CollectionHistory, ToastMessage, UserStatus, SensorReading
} from '../types';
import { api } from '../api/index';

interface AppContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => void;

  isLoading: boolean;
  bins: TrashBin[];
  users: User[];
  reports: Report[];
  collectionHistory: CollectionHistory[];
  sensorHistory: SensorReading[];

  toasts: ToastMessage[];
  addToast: (type: ToastMessage['type'], message: string) => void;
  removeToast: (id: string) => void;

  // Bin CRUD
  addBin: (data: Omit<TrashBin, 'id' | 'status' | 'lastUpdated'>) => Promise<void>;
  updateBin: (id: string, data: Omit<TrashBin, 'id' | 'status' | 'lastUpdated'>) => Promise<void>;
  deleteBin: (id: string) => Promise<void>;
  markBinCollected: (binId: string, petugasId: string, petugasName: string) => Promise<void>;

  // User CRUD
  addUser: (data: Omit<User, 'id'>) => Promise<void>;
  editUser: (id: string, data: Omit<User, 'id'>) => Promise<void>;
  toggleUserStatus: (id: string, currentStatus: UserStatus) => Promise<void>;

  // Report actions
  updateReportStatus: (reportId: string, status: Report['status']) => Promise<void>;
  addReport: (report: Omit<Report, 'id' | 'submittedAt' | 'status'>) => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bins, setBins] = useState<TrashBin[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [collectionHistory, setCollectionHistory] = useState<CollectionHistory[]>([]);
  const [sensorHistory, setSensorHistory] = useState<SensorReading[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    Promise.all([
      api.bins.getAll() as Promise<TrashBin[]>,
      api.users.getAll() as Promise<User[]>,
      api.reports.getAll() as Promise<Report[]>,
      api.collections.getAll() as Promise<CollectionHistory[]>,
      api.sensors.getAll() as Promise<SensorReading[]>,
    ])
      .then(([b, u, r, c, s]) => {
        setBins(b);
        setUsers(u);
        setReports(r);
        setCollectionHistory(c);
        setSensorHistory(s);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const addToast = useCallback((type: ToastMessage['type'], message: string) => {
    const id = `toast-${Date.now()}`;
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<User | null> => {
    try {
      const user = await api.auth.login(email, password) as User;
      setCurrentUser(user);
      return user;
    } catch {
      return null;
    }
  }, []);

  const logout = useCallback(() => setCurrentUser(null), []);

  // ── Bin operations ──────────────────────────────────────────────
  const addBin = useCallback(async (data: Omit<TrashBin, 'id' | 'status' | 'lastUpdated'>) => {
    const newBin = await api.bins.create(data) as TrashBin;
    setBins(prev => [...prev, newBin]);
  }, []);

  const updateBin = useCallback(async (id: string, data: Omit<TrashBin, 'id' | 'status' | 'lastUpdated'>) => {
    const updated = await api.bins.update(id, data) as TrashBin;
    setBins(prev => prev.map(b => b.id === id ? updated : b));
  }, []);

  const deleteBin = useCallback(async (id: string) => {
    await api.bins.delete(id);
    setBins(prev => prev.filter(b => b.id !== id));
  }, []);

  const markBinCollected = useCallback(async (binId: string, petugasId: string, petugasName: string) => {
    const result = await api.bins.collect(binId, { petugasId, petugasName }) as {
      bin: TrashBin;
      collection: CollectionHistory;
    };
    setBins(prev => prev.map(b => b.id === binId ? result.bin : b));
    setCollectionHistory(prev => [result.collection, ...prev]);
  }, []);

  // ── User operations ─────────────────────────────────────────────
  const addUser = useCallback(async (data: Omit<User, 'id'>) => {
    const newUser = await api.users.create(data) as User;
    setUsers(prev => [...prev, newUser]);
  }, []);

  const editUser = useCallback(async (id: string, data: Omit<User, 'id'>) => {
    const updated = await api.users.update(id, data) as User;
    setUsers(prev => prev.map(u => u.id === id ? updated : u));
  }, []);

  const toggleUserStatus = useCallback(async (id: string, currentStatus: UserStatus) => {
    const next: UserStatus = currentStatus === 'Aktif' ? 'Nonaktif' : 'Aktif';
    const updated = await api.users.patchStatus(id, next) as User;
    setUsers(prev => prev.map(u => u.id === id ? updated : u));
  }, []);

  // ── Report operations ────────────────────────────────────────────
  const updateReportStatus = useCallback(async (reportId: string, status: Report['status']) => {
    await api.reports.updateStatus(reportId, status);
    setReports(prev => prev.map(r => r.id === reportId ? { ...r, status } : r));
  }, []);

  const addReport = useCallback(async (report: Omit<Report, 'id' | 'submittedAt' | 'status'>) => {
    const newReport = await api.reports.create(report) as Report;
    setReports(prev => [newReport, ...prev]);
  }, []);

  return (
    <AppContext.Provider value={{
      currentUser, login, logout,
      isLoading,
      bins, users, reports, collectionHistory, sensorHistory,
      toasts, addToast, removeToast,
      addBin, updateBin, deleteBin, markBinCollected,
      addUser, editUser, toggleUserStatus,
      updateReportStatus, addReport,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
