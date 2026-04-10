import { useNavigate, useParams } from 'react-router-dom';
import { useMemoryEditor } from './useMemoryAdmin';
import { ArrowLeft, Plus, Trash2, Save, Loader2 } from 'lucide-react';
import s from './MemoryEditor.module.css';

export default function MemoryEditor() {
  const { id } = useParams<{ id?: string }>();
  const nav = useNavigate();
  const editor = useMemoryEditor(id);

  // Loading existing deck
  if (editor.isLoading) {
    return (
      <div className={s.page}>
        <div className={s.inner}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '40px 0', color: 'var(--text-2)' }}>
            <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
            Loading deck…
          </div>
        </div>
      </div>
    );
  }

  // Saved confirmation
  if (editor.saved) {
    return (
      <div className={s.page}>
        <div className={s.inner}>
          <div className={s.savedBox}>
            <div className={s.savedIcon}>✅</div>
            <h3 style={{ margin: '0 0 8px', fontSize: 20 }}>Deck Saved!</h3>
            <p className="helper-text" style={{ marginBottom: 24 }}>
              "{editor.name}" is ready to play.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button className="btn btn-secondary" onClick={() => nav('/admin/memory')}>
                View All Decks
              </button>
              <button className="btn btn-primary" onClick={() => nav('/play')}>
                Go to Player Hub
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={s.page}>
      <div className={s.inner}>
        <div className={s.header}>
          <button className={s.backBtn} onClick={() => nav('/admin/memory')}>
            <ArrowLeft size={15} /> Decks
          </button>
          <h1 className={s.pageTitle}>{id ? '✏️ Edit Deck' : '➕ New Deck'}</h1>
        </div>

        {editor.error && (
          <div className="validation-errors" style={{ marginBottom: 16 }}>
            <p className="validation-errors-title">{editor.error}</p>
          </div>
        )}

        <div className="card">
          <div className="field">
            <label className="field-label">Deck Name</label>
            <input
              className="input"
              value={editor.name}
              onChange={(e) => editor.setName(e.target.value)}
              placeholder="e.g. Addition Basics"
            />
          </div>

          <div className={s.pairsHeader}>
            <h3 className={s.pairsTitle}>Equation–Answer Pairs ({editor.pairs.length})</h3>
            <button className="btn btn-secondary" onClick={editor.addPair}>
              <Plus size={13} /> Add Pair
            </button>
          </div>

          {editor.pairs.map((pair, i) => (
            <div key={pair.id} className={s.pairRow}>
              <span className={s.pairNum}>{i + 1}</span>
              <input
                className="input"
                value={pair.equation}
                onChange={(e) => editor.updatePair(pair.id, 'equation', e.target.value)}
                placeholder="Equation, e.g. 3 × 4"
              />
              <input
                className="input"
                value={pair.answer}
                onChange={(e) => editor.updatePair(pair.id, 'answer', e.target.value)}
                placeholder="Answer, e.g. 12"
              />
              <button
                className="btn btn-danger btn-icon"
                onClick={() => editor.removePair(pair.id)}
                disabled={editor.pairs.length <= 2}
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}

          <div className={s.actions}>
            <button className="btn btn-secondary" onClick={() => nav('/admin/memory')}>
              Cancel
            </button>
            <button className="btn btn-success" onClick={editor.save} disabled={editor.isSaving}>
              {editor.isSaving ? (
                <><Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> Saving…</>
              ) : (
                <><Save size={13} /> Save Deck</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
