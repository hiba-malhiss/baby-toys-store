import { useNavigate } from 'react-router-dom';
import { useMemoryList } from './useMemoryAdmin';
import { ArrowLeft, Plus, Pencil, Trash2, Layers } from 'lucide-react';
import s from './MemoryAdminList.module.css';

export default function MemoryAdminList() {
  const nav = useNavigate();
  const { decks, remove, query, isDeleting } = useMemoryList();

  return (
    <div className={s.page}>
      <div className={s.inner}>
        <div className={s.header}>
          <div className={s.headerLeft}>
            <button className={s.backBtn} onClick={() => nav('/admin')}>
              <ArrowLeft size={15} /> Back
            </button>
            <h1 className={s.pageTitle}>🃏 Memory Decks</h1>
            {decks.length > 0 && (
              <span className="badge badge-brand">
                {decks.length} deck{decks.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          <button className="btn btn-primary" onClick={() => nav('/admin/memory/new')}>
            <Plus size={14} /> New Deck
          </button>
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {query.isLoading && (
            <p className="empty-text" style={{ padding: '24px' }}>
              Loading decks…
            </p>
          )}
          {query.isError && (
            <p className="error-text" style={{ padding: '24px' }}>
              Failed to load decks. {query.error?.message}
            </p>
          )}
          {!query.isLoading && !query.isError && decks.length === 0 && (
            <p className="empty-text" style={{ padding: '24px' }}>
              No decks yet. Create one to get started!
            </p>
          )}
          {!query.isLoading && decks.length > 0 && (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr
                  style={{
                    background: 'var(--surface-2)',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  {['Name', 'Pairs', 'Created', ''].map((h) => (
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
                {decks.map((deck, i) => (
                  <tr
                    key={deck.id}
                    style={{
                      borderBottom: i < decks.length - 1 ? '1px solid var(--border)' : 'none',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-2)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = '')}
                  >
                    <td style={{ padding: '12px 16px', fontWeight: 700 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Layers size={14} color="var(--brand)" />
                        {deck.name}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-2)' }}>
                      {deck.pairCount} pairs
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-3)', fontSize: 12 }}>
                      {new Date(deck.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                        <button
                          className="btn btn-secondary"
                          onClick={() => nav(`/admin/memory/${deck.id}/edit`)}
                        >
                          <Pencil size={13} /> Edit
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => remove(deck.id, deck.name)}
                          disabled={isDeleting}
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
