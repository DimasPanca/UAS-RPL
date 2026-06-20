import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Layout } from './components/Layout/Layout';

import { Login } from './pages/Login';

import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ManajemenBin } from './pages/admin/ManajemenBin';
import { ManajemenPengguna } from './pages/admin/ManajemenPengguna';
import { LaporanWarga } from './pages/admin/LaporanWarga';
import { RekapBulanan } from './pages/admin/RekapBulanan';

import { PriorityList } from './pages/petugas/PriorityList';
import { RiwayatTugas } from './pages/petugas/RiwayatTugas';

import { KondisiBin } from './pages/warga/KondisiBin';
import { BuatLaporan } from './pages/warga/BuatLaporan';
import { RiwayatLaporan } from './pages/warga/RiwayatLaporan';

const ProtectedRoute: React.FC<{ children: React.ReactNode; requiredRole?: string }> = ({
  children, requiredRole
}) => {
  const { currentUser } = useApp();
  if (!currentUser) return <Navigate to="/" replace />;
  if (requiredRole && currentUser.role !== requiredRole) return <Navigate to="/" replace />;
  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      {/* Admin */}
      <Route path="/admin" element={
        <ProtectedRoute requiredRole="admin">
          <Layout><AdminDashboard /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/admin/bins" element={
        <ProtectedRoute requiredRole="admin">
          <Layout><ManajemenBin /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/admin/users" element={
        <ProtectedRoute requiredRole="admin">
          <Layout><ManajemenPengguna /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/admin/reports" element={
        <ProtectedRoute requiredRole="admin">
          <Layout><LaporanWarga /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/admin/recap" element={
        <ProtectedRoute requiredRole="admin">
          <Layout><RekapBulanan /></Layout>
        </ProtectedRoute>
      } />

      {/* Petugas */}
      <Route path="/petugas" element={
        <ProtectedRoute requiredRole="petugas">
          <Layout><PriorityList /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/petugas/history" element={
        <ProtectedRoute requiredRole="petugas">
          <Layout><RiwayatTugas /></Layout>
        </ProtectedRoute>
      } />

      {/* Warga */}
      <Route path="/warga" element={
        <ProtectedRoute requiredRole="warga">
          <Layout><KondisiBin /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/warga/report" element={
        <ProtectedRoute requiredRole="warga">
          <Layout><BuatLaporan /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/warga/history" element={
        <ProtectedRoute requiredRole="warga">
          <Layout><RiwayatLaporan /></Layout>
        </ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
