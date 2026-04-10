import { Navigate, Route, Routes } from 'react-router-dom';
import { Flex } from '@baby-toys/ui-kit';

// Components
import Header from './components/Header/Header';
import ProtectedAdminRoute from './components/ProtectedAdminRoute/ProtectedAdminRoute';

// Auth
import { AdminAuthProvider } from './context/AuthContext';

// Pages
import AuthRedirect from './pages/AuthRedirect';
import AdminHub from './pages/AdminHub';
import PlayerHub from './pages/PlayerHub';

// Board
import BoardAdminList from './board/admin/BoardAdminList';
import BoardWizard from './board/admin/BoardWizard';
import BoardPlayerPage from './board/player/BoardPlayerPage';

// Memory
import MemoryAdminList from './memory/admin/MemoryAdminList';
import MemoryEditor from './memory/admin/MemoryEditor';
import MemoryPlayerPage from './memory/player/MemoryPlayerPage';

export default function App() {
  return (
    <AdminAuthProvider>
      <Flex direction="vertical" fullWidth>
        <Header />
        <main style={{ width: '100%' }}>
          <Routes>
            {/* Auth redirect - handles automatic routing based on auth status */}
            <Route path="/" element={<AuthRedirect />} />

            {/* ── Admin routes — protected, admin only ─────────────────── */}
            <Route path="/admin" element={
              <ProtectedAdminRoute><AdminHub /></ProtectedAdminRoute>
            } />
            <Route path="/admin/board" element={
              <ProtectedAdminRoute><BoardAdminList /></ProtectedAdminRoute>
            } />
            <Route path="/admin/board/new" element={
              <ProtectedAdminRoute><BoardWizard /></ProtectedAdminRoute>
            } />
            <Route path="/admin/board/:id/edit" element={
              <ProtectedAdminRoute><BoardWizard /></ProtectedAdminRoute>
            } />
            <Route path="/admin/memory" element={
              <ProtectedAdminRoute><MemoryAdminList /></ProtectedAdminRoute>
            } />
            <Route path="/admin/memory/new" element={
              <ProtectedAdminRoute><MemoryEditor /></ProtectedAdminRoute>
            } />
            <Route path="/admin/memory/:id/edit" element={
              <ProtectedAdminRoute><MemoryEditor /></ProtectedAdminRoute>
            } />

            {/* ── Player routes — public ────────────────────────────────── */}
            <Route path="/play" element={<PlayerHub />} />
            <Route path="/play/board/:id" element={<BoardPlayerPage />} />
            <Route path="/play/memory/:id" element={<MemoryPlayerPage />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </Flex>
    </AdminAuthProvider>
  );
}
