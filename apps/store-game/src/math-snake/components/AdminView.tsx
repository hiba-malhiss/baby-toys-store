import { useState } from 'react';
import type { Deck, DeckEquation } from '../types';
import { addDeck, deleteDeck, updateDeck } from '../utils/storage';
import styles from './AdminView.module.css';

interface Props {
  decks: Deck[];
  onDecksChange: () => void;
}

function Toast({ msg }: { msg: string }) {
  return msg ? <div className={styles.toast}>{msg}</div> : null;
}

export function AdminView({ decks, onDecksChange }: Props) {
  const [deckName, setDeckName] = useState('');
  const [eqExpr, setEqExpr] = useState('');
  const [eqAnswer, setEqAnswer] = useState('');
  const [eqType, setEqType] = useState<'correct' | 'wrong'>('correct');
  const [formEqs, setFormEqs] = useState<DeckEquation[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [toast, setToast] = useState('');

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 2200);
  }

  function handleAddEq() {
    if (!eqExpr.trim()) {
      showToast('Enter an expression');
      return;
    }
    const ans = parseInt(eqAnswer);
    if (!ans || isNaN(ans)) {
      showToast('Enter the snake answer value');
      return;
    }
    setFormEqs((prev) => [
      ...prev,
      { expr: eqExpr.trim(), answer: ans, correct: eqType === 'correct' },
    ]);
    setEqExpr('');
  }

  function removeFormEq(i: number) {
    setFormEqs((prev) => prev.filter((_, idx) => idx !== i));
  }

  function handleSave() {
    if (!deckName.trim()) {
      showToast('Give the deck a name');
      return;
    }
    if (formEqs.length < 2) {
      showToast('Add at least 2 equations');
      return;
    }
    if (editingId !== null) {
      updateDeck({ id: editingId, name: deckName, equations: formEqs });
      showToast(`Deck "${deckName}" updated!`);
    } else {
      addDeck({ name: deckName, equations: formEqs });
      showToast(`Deck "${deckName}" saved!`);
    }
    clearForm();
    onDecksChange();
  }

  function clearForm() {
    setDeckName('');
    setEqExpr('');
    setEqAnswer('');
    setFormEqs([]);
    setEditingId(null);
    setEqType('correct');
  }

  function handleEdit(deck: Deck) {
    setDeckName(deck.name);
    setFormEqs([...deck.equations]);
    setEditingId(deck.id);
  }

  function handleDelete(id: number) {
    deleteDeck(id);
    onDecksChange();
    showToast('Deck deleted');
  }

  return (
    <div className={styles.wrap}>
      {/* Create / edit form */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>
          {editingId !== null ? 'Edit deck' : 'Create a new equation deck'}
        </h3>

        <label className={styles.label}>
          Deck name
          <input
            className={styles.input}
            value={deckName}
            onChange={(e) => setDeckName(e.target.value)}
            placeholder="e.g. Multiplication Tables"
            maxLength={40}
          />
        </label>

        <div className={styles.row2}>
          <label className={styles.label}>
            Snake answer value
            <input
              className={styles.input}
              type="number"
              min={1}
              max={100}
              value={eqAnswer}
              onChange={(e) => setEqAnswer(e.target.value)}
              placeholder="e.g. 12"
            />
          </label>
          <label className={styles.label}>
            Equation type
            <select
              className={styles.input}
              value={eqType}
              onChange={(e) => setEqType(e.target.value as 'correct' | 'wrong')}
            >
              <option value="correct">✅ Correct (= answer)</option>
              <option value="wrong">❌ Wrong (≠ answer)</option>
            </select>
          </label>
        </div>

        <label className={styles.label}>
          Expression
          <input
            className={styles.input}
            value={eqExpr}
            onChange={(e) => setEqExpr(e.target.value)}
            placeholder="e.g.  3×4  or  6+6  or  15−3"
            onKeyDown={(e) => e.key === 'Enter' && handleAddEq()}
          />
        </label>

        <div className={styles.addRow}>
          <button className={styles.btnPrimary} onClick={handleAddEq}>
            + Add equation
          </button>
          <span className={styles.hint}>
            {formEqs.length > 0
              ? `${formEqs.length} equation${formEqs.length > 1 ? 's' : ''} added`
              : ''}
          </span>
        </div>

        {formEqs.length > 0 && (
          <div className={styles.eqList}>
            {formEqs.map((eq, i) => (
              <div key={i} className={styles.eqItem}>
                <span className={styles.eqExpr}>{eq.expr}</span>
                <span className={styles.eqAns}>answer: {eq.answer}</span>
                <span className={eq.correct ? styles.tagOk : styles.tagBad}>
                  {eq.correct ? 'correct' : 'wrong'}
                </span>
                <button className={styles.btnRemove} onClick={() => removeFormEq(i)}>
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <div className={styles.saveRow}>
          <button className={styles.btnPrimary} onClick={handleSave}>
            {editingId !== null ? 'Update deck' : 'Save deck'}
          </button>
          <button className={styles.btnGhost} onClick={clearForm}>
            Clear
          </button>
        </div>
      </div>

      {/* Deck list */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Saved decks</h3>
        {decks.length === 0 ? (
          <p className={styles.empty}>No custom decks yet. Create one above!</p>
        ) : (
          decks.map((deck) => (
            <div key={deck.id} className={styles.deckItem}>
              <div>
                <div className={styles.deckName}>{deck.name}</div>
                <div className={styles.deckMeta}>
                  {deck.equations.length} equations ·{' '}
                  {deck.equations.filter((e) => e.correct).length} correct,{' '}
                  {deck.equations.filter((e) => !e.correct).length} wrong
                </div>
              </div>
              <div className={styles.deckActions}>
                <button className={styles.btnGhost} onClick={() => handleEdit(deck)}>
                  Edit
                </button>
                <button className={styles.btnDanger} onClick={() => handleDelete(deck.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <Toast msg={toast} />
    </div>
  );
}
