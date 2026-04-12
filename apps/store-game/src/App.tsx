import { Navigate, Route, Routes } from 'react-router-dom';
import { Flex } from '@baby-toys/ui-kit';

import Header from './components/Header/Header';
import ProtectedAdminRoute from './components/ProtectedAdminRoute/ProtectedAdminRoute';
import { AdminAuthProvider } from './context/AuthContext';

import AuthRedirect from './pages/AuthRedirect';
import AdminHub from './pages/AdminHub';
import PlayerHub from './pages/PlayerHub';

import BoardAdminList from './board/admin/BoardAdminList';
import BoardWizard from './board/admin/BoardWizard';
import BoardPlayerPage from './board/player/BoardPlayerPage';

import MemoryAdminList from './memory/admin/MemoryAdminList';
import MemoryEditor from './memory/admin/MemoryEditor';
import MemoryPlayerPage from './memory/player/MemoryPlayerPage';

import MazeAdminList from './maze/admin/MazeAdminList';
import MazeEditor from './maze/admin/MazeEditor';
import MazePlayerPage from './maze/player/MazePlayerPage';

import SnakeApp from './math-snake/App';

export default function App() {
  return (
    <AdminAuthProvider>
      <Flex direction="vertical" fullWidth>
        <Header />
        <main style={{ width: '100%' }}>
          <Routes>
            <Route path="/" element={<AuthRedirect />} />

            {/* ── Admin — protected ─────────────────────────────────── */}
            <Route
              path="/admin"
              element={
                <ProtectedAdminRoute>
                  <AdminHub />
                </ProtectedAdminRoute>
              }
            />

            <Route
              path="/admin/board"
              element={
                <ProtectedAdminRoute>
                  <BoardAdminList />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/board/new"
              element={
                <ProtectedAdminRoute>
                  <BoardWizard />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/board/:id/edit"
              element={
                <ProtectedAdminRoute>
                  <BoardWizard />
                </ProtectedAdminRoute>
              }
            />

            <Route
              path="/admin/memory"
              element={
                <ProtectedAdminRoute>
                  <MemoryAdminList />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/memory/new"
              element={
                <ProtectedAdminRoute>
                  <MemoryEditor />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/memory/:id/edit"
              element={
                <ProtectedAdminRoute>
                  <MemoryEditor />
                </ProtectedAdminRoute>
              }
            />

            <Route
              path="/admin/maze"
              element={
                <ProtectedAdminRoute>
                  <MazeAdminList />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/maze/new"
              element={
                <ProtectedAdminRoute>
                  <MazeEditor />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/maze/:deckId/edit"
              element={
                <ProtectedAdminRoute>
                  <MazeEditor />
                </ProtectedAdminRoute>
              }
            />

            <Route
              path="/admin/snake"
              element={
                <ProtectedAdminRoute>
                  <SnakeApp />
                </ProtectedAdminRoute>
              }
            />

            {/* ── Player — public ───────────────────────────────────── */}
            <Route path="/play" element={<PlayerHub />} />
            <Route path="/play/board/:id" element={<BoardPlayerPage />} />
            <Route path="/play/memory/:id" element={<MemoryPlayerPage />} />
            <Route path="/play/maze/:deckId" element={<MazePlayerPage />} />
            <Route path="/play/snake" element={<SnakeApp />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </Flex>
    </AdminAuthProvider>
  );
}
