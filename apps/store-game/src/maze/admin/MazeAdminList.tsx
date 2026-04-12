import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Pencil, Trash2, Map } from 'lucide-react';
import { listMazeConfigs, deleteMazeConfig } from '../shared/mazeTypes';
import { useState } from 'react';
import s from './MazeAdminList.module.css';

export default function MazeAdminList() {
  const nav = useNavigate();
  const [mazes, setMazes] = useState(() => listMazeConfigs());

  const handleDelete = (deckId: string, name: string) => {
    if (!window.confirm(`Delete maze for "${name}"?`)) return;
    deleteMazeConfig(deckId);
    setMazes(listMazeConfigs());
  };

  return (
    <div className={s.page}>
      <div className={s.inner}>
        <div className={s.header}>
          <div className={s.headerLeft}>
            <button className={s.backBtn} onClick={() => nav('/admin')}>
              <ArrowLeft size={15} /> Back
            </button>
            <h1 className={s.pageTitle}>🗺️ Math Mazes</h1>
            {mazes.length > 0 && (
              <span className="badge badge-brand">
                {mazes.length} maze{mazes.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          <button className="btn btn-primary" onClick={() => nav('/admin/maze/new')}>
            <Plus size={14} /> New Maze
          </button>
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {mazes.length === 0 && (
            <p className="empty-text" style={{ padding: '24px' }}>
              No mazes yet. Create one to get started!
            </p>
          )}

          {mazes.length > 0 && (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr
                  style={{
                    background: 'var(--surface-2)',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  {['Maze', 'Deck', 'Grid', 'Target Answer', ''].map((h) => (
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
                {mazes.map((m, i) => (
                  <tr
                    key={m.deckId}
                    style={{
                      borderBottom: i < mazes.length - 1 ? '1px solid var(--border)' : 'none',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-2)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = '')}
                  >
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Map size={14} color="var(--brand)" />
                        <span style={{ fontWeight: 700 }}>{m.deckName} Maze</span>
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-2)' }}>{m.deckName}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-2)' }}>
                      {m.width} × {m.height}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span className="badge badge-brand">{m.targetAnswer}</span>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                        <button
                          className="btn btn-secondary"
                          onClick={() => nav(`/admin/maze/${m.deckId}/edit`)}
                        >
                          <Pencil size={13} /> Edit
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(m.deckId, m.deckName)}
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
