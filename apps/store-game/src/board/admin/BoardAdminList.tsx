import { useNavigate } from 'react-router-dom';
import { useBoardList } from './useBoardAdmin';
import { useDeleteBoard } from '@/api/boardApi';
import { ArrowLeft } from 'lucide-react';
import { useBoardThumbnail } from '../../hooks/useBoardThumbnail';
import s from './BoardAdminList.module.css';

// Isolated so each row has its own hook instance and IntersectionObserver
function BoardThumbnail({ boardId }: { boardId: number }) {
  const canvasRef = useBoardThumbnail(boardId, 56);
  return <canvas ref={canvasRef} width={56} height={56} className={s.thumbnail} />;
}

export default function BoardAdminList() {
  const nav = useNavigate();
  const { query, page, setPage } = useBoardList();
  const deleteMutation = useDeleteBoard();

  const boards = query.data?.content ?? [];
  const total = query.data?.totalElements ?? 0;
  const pages = query.data?.totalPages ?? 1;

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    await deleteMutation.mutateAsync(id);
  };

  return (
    <div className={s.page}>
      <div className={s.inner}>
        <div className={s.header}>
          <div className={s.headerLeft}>
            <button className={s.backBtn} onClick={() => nav('/admin')}>
              <ArrowLeft size={15} /> Back
            </button>
            <h1 className={s.pageTitle}>🧩 Board Games</h1>
            {total > 0 && (
              <span className="badge badge-brand">
                {total} board{total !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          <button className="btn btn-primary" onClick={() => nav('/admin/board/new')}>
            + New Board
          </button>
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {query.isLoading && (
            <p className="helper-text" style={{ padding: '20px' }}>
              Loading…
            </p>
          )}

          {!query.isLoading && boards.length === 0 && (
            <p className="empty-text" style={{ padding: '24px' }}>
              No boards yet. Create your first one!
            </p>
          )}

          {!query.isLoading && boards.length > 0 && (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr
                  style={{
                    background: 'var(--surface-2)',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  {['Preview', 'Name', 'Size', 'Status', ''].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: '10px 16px',
                        textAlign: h === '' ? 'right' : 'left',
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: '.07em',
                        textTransform: 'uppercase',
                        color: 'var(--text-2)',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {boards.map((b, i) => (
                  <tr
                    key={b.id}
                    style={{
                      borderBottom: i < boards.length - 1 ? '1px solid var(--border)' : 'none',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-2)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = '')}
                  >
                    <td style={{ padding: '10px 16px' }}>
                      <BoardThumbnail boardId={b.id} />
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 700 }}>{b.name}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-2)' }}>
                      {b.width} × {b.height}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span className={`badge ${b.isActive ? 'badge-success' : 'badge-danger'}`}>
                        {b.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                        <button
                          className="btn btn-secondary"
                          onClick={() => nav(`/admin/board/${b.id}/edit`)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(b.id, b.name)}
                          disabled={deleteMutation.isPending}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Pagination */}
          {pages > 1 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderTop: '1px solid var(--border)',
                fontSize: 13,
                color: 'var(--text-2)',
              }}
            >
              <span>
                Page {page + 1} of {pages}
              </span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  className="btn btn-secondary"
                  disabled={page === 0}
                  onClick={() => setPage((p) => p - 1)}
                >
                  ← Prev
                </button>
                <button
                  className="btn btn-secondary"
                  disabled={page >= pages - 1}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
