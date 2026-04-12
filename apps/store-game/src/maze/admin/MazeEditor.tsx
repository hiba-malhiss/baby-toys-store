import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, RefreshCw } from 'lucide-react';
import { useMemoryDecksQuery } from '@/api/memoryApi';
import { useMemoryDeckDetailQuery } from '@/api/memoryApi';
import { evaluateEquation } from '@/shared/boardUtils';
import { saveMazeConfig, loadMazeConfig, type MazeConfig } from '../shared/mazeTypes';
import s from './MazeEditor.module.css';

const ODD_SIZES = [7, 9, 11, 13, 15];

export default function MazeEditor() {
  const { deckId } = useParams<{ deckId?: string }>();
  const nav = useNavigate();
  const isEdit = !!deckId;

  // Load all available decks for the selector
  const decksQuery = useMemoryDecksQuery({ page: 0, size: 100 });
  const allDecks = decksQuery.data?.content ?? [];

  const [selectedDeckId, setSelectedDeckId] = useState(deckId ?? '');
  const [width, setWidth] = useState(9);
  const [height, setHeight] = useState(9);
  const [targetAnswer, setTargetAnswer] = useState('');
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 99999));
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  // Load detail of selected deck to preview valid target answers
  const deckDetail = useMemoryDeckDetailQuery(selectedDeckId || null);
  const pairs = deckDetail.data?.pairs ?? [];

  // Unique answers from the selected deck
  const uniqueAnswers = [...new Set(pairs.map((p) => evaluateEquation(p.equation)))].sort();

  // Pre-fill when editing
  useEffect(() => {
    if (isEdit && deckId) {
      const existing = loadMazeConfig(deckId);
      if (existing) {
        setSelectedDeckId(existing.deckId);
        setWidth(existing.width);
        setHeight(existing.height);
        setTargetAnswer(existing.targetAnswer);
        setSeed(existing.seed);
      }
    }
  }, [isEdit, deckId]);

  const handleSave = () => {
    if (!selectedDeckId) {
      setError('Please select a memory deck.');
      return;
    }
    if (!targetAnswer) {
      setError('Please choose a target answer.');
      return;
    }

    const deck = allDecks.find((d) => d.id === selectedDeckId);
    const config: MazeConfig = {
      deckId: selectedDeckId,
      deckName: deck?.name ?? selectedDeckId,
      width,
      height,
      seed,
      targetAnswer,
      createdAt: loadMazeConfig(selectedDeckId)?.createdAt ?? Date.now(),
      updatedAt: Date.now(),
    };

    saveMazeConfig(config);
    setSaved(true);
  };

  const rerollSeed = () => setSeed(Math.floor(Math.random() * 99999));

  if (saved) {
    return (
      <div className={s.page}>
        <div className={s.inner}>
          <div className={s.savedBox}>
            <div className={s.savedIcon}>🗺️</div>
            <h3 style={{ margin: '0 0 8px', fontSize: 20 }}>Maze Saved!</h3>
            <p className="helper-text" style={{ marginBottom: 24 }}>
              Players can now find and play this maze.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button className="btn btn-secondary" onClick={() => nav('/admin/maze')}>
                View All Mazes
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
          <button className={s.backBtn} onClick={() => nav('/admin/maze')}>
            <ArrowLeft size={15} /> Mazes
          </button>
          <h1 className={s.pageTitle}>{isEdit ? '✏️ Edit Maze' : '➕ New Maze'}</h1>
        </div>

        {error && (
          <div className="validation-errors" style={{ marginBottom: 16 }}>
            <p className="validation-errors-title">{error}</p>
          </div>
        )}

        <div className={s.formGrid}>
          {/* Deck selector */}
          <div className="card">
            <h3 className={s.cardTitle}>1. Choose a Memory Deck</h3>
            <p className="helper-text" style={{ marginBottom: 16 }}>
              The maze will be built from this deck's equations. Players must only step on cells
              whose equation equals the target answer.
            </p>

            {decksQuery.isLoading ? (
              <div
                style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-2)' }}
              >
                <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> Loading
                decks…
              </div>
            ) : allDecks.length === 0 ? (
              <p className="empty-text">
                No memory decks found.{' '}
                <button
                  className="btn btn-secondary"
                  style={{ display: 'inline-flex', padding: '4px 10px', fontSize: 12 }}
                  onClick={() => nav('/admin/memory/new')}
                >
                  Create one first
                </button>
              </p>
            ) : (
              <div className={s.deckList}>
                {allDecks.map((d) => (
                  <button
                    key={d.id}
                    className={`${s.deckOption} ${selectedDeckId === d.id ? s.deckOptionActive : ''}`}
                    onClick={() => {
                      setSelectedDeckId(d.id);
                      setTargetAnswer('');
                    }}
                  >
                    <span className={s.deckOptionName}>{d.name}</span>
                    <span className={s.deckOptionMeta}>{d.pairCount} pairs</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Target answer */}
          <div className="card">
            <h3 className={s.cardTitle}>2. Set Target Answer</h3>
            <p className="helper-text" style={{ marginBottom: 16 }}>
              Players can only walk on cells whose equation evaluates to this answer. Pick one that
              appears in several pairs so there's a solvable path.
            </p>

            {!selectedDeckId && <p className="empty-text">Select a deck first.</p>}
            {selectedDeckId && deckDetail.isLoading && (
              <div
                style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-2)' }}
              >
                <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> Loading
                pairs…
              </div>
            )}
            {selectedDeckId && !deckDetail.isLoading && uniqueAnswers.length > 0 && (
              <div className={s.answerPills}>
                {uniqueAnswers.map((ans) => {
                  const count = pairs.filter((p) => evaluateEquation(p.equation) === ans).length;
                  return (
                    <button
                      key={ans}
                      className={`${s.answerPill} ${targetAnswer === ans ? s.answerPillActive : ''}`}
                      onClick={() => setTargetAnswer(ans)}
                    >
                      = {ans}
                      <span className={s.answerPillCount}>{count}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Manual override */}
            <div className="field" style={{ marginTop: 16 }}>
              <label className="field-label">Or type a custom answer</label>
              <input
                className="input"
                value={targetAnswer}
                onChange={(e) => setTargetAnswer(e.target.value)}
                placeholder="e.g. 4"
                style={{ maxWidth: 200 }}
              />
            </div>
          </div>

          {/* Grid size + seed */}
          <div className="card">
            <h3 className={s.cardTitle}>3. Grid & Seed</h3>

            <div className="field-row" style={{ marginBottom: 16 }}>
              <div className="field">
                <label className="field-label">Width (columns)</label>
                <select
                  className="input"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                >
                  {ODD_SIZES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label className="field-label">Height (rows)</label>
                <select
                  className="input"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                >
                  {ODD_SIZES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="field">
              <label className="field-label">Seed (controls maze layout)</label>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input
                  className="input"
                  type="number"
                  value={seed}
                  onChange={(e) => setSeed(Number(e.target.value))}
                  style={{ maxWidth: 140 }}
                />
                <button
                  className="btn btn-secondary"
                  onClick={rerollSeed}
                  title="Generate new layout"
                >
                  <RefreshCw size={14} /> Reroll
                </button>
              </div>
              <p className="helper-text">
                Change the seed to get a different maze layout with the same settings.
              </p>
            </div>
          </div>
        </div>

        <div className={s.actions}>
          <button
            className="btn btn-primary btn-lg"
            onClick={handleSave}
            disabled={!selectedDeckId || !targetAnswer}
          >
            <Save size={15} /> Save Maze
          </button>
        </div>
      </div>
    </div>
  );
}
