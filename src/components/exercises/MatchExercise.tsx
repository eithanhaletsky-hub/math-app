import { useEffect, useMemo, useRef, useState } from 'react';
import { shuffle } from '../../content/lib/random';
import { MathText } from '../RichText';
import { VisualView } from '../visuals/VisualView';
import type { MatchItem } from '../../content/types';
import type { ExerciseProps } from './types';

interface Chip {
  id: number;
  item: MatchItem;
}

interface DragInfo {
  chipId: number;
  startX: number;
  startY: number;
  moved: boolean;
}

function ItemView({ item }: { item: MatchItem }) {
  return item.visual ? <VisualView v={item.visual} /> : <MathText>{item.label}</MathText>;
}

/**
 * Drag each answer chip onto its slot. Works with mouse and touch (Pointer Events).
 * Tap-tap also works: tap a chip, then tap a slot.
 */
export function MatchExercise({ q, locked, reveal, onSubmit }: ExerciseProps<'match'>) {
  const chips = useMemo<Chip[]>(() => shuffle(q.pairs.map((p, i) => ({ id: i, item: p.right }))), [q]);
  const [placed, setPlaced] = useState<(number | null)[]>(() => q.pairs.map(() => null));
  const [selected, setSelected] = useState<number | null>(null);
  const [wrongSlots, setWrongSlots] = useState<Set<number>>(new Set());
  const [rightAll, setRightAll] = useState(false);
  const [floating, setFloating] = useState<{ chipId: number; x: number; y: number } | null>(null);
  const drag = useRef<DragInfo | null>(null);
  const placedRef = useRef(placed);
  placedRef.current = placed;

  const chipById = (id: number) => chips.find((c) => c.id === id)!;
  const inBank = chips.filter((c) => !placed.includes(c.id));

  const placeChip = (chipId: number, slot: number | null) => {
    setPlaced((prev) => {
      const next = prev.map((v) => (v === chipId ? null : v));
      if (slot !== null) next[slot] = chipId; // a chip already there goes back to the bank
      return next;
    });
    setWrongSlots(new Set());
    setSelected(null);
  };

  // window listeners while a chip is held
  useEffect(() => {
    const move = (e: PointerEvent) => {
      const d = drag.current;
      if (!d) return;
      if (!d.moved && Math.hypot(e.clientX - d.startX, e.clientY - d.startY) > 6) d.moved = true;
      if (d.moved) setFloating({ chipId: d.chipId, x: e.clientX, y: e.clientY });
    };
    const up = (e: PointerEvent) => {
      const d = drag.current;
      if (!d) return;
      drag.current = null;
      setFloating(null);
      if (!d.moved) {
        // a tap: select / unselect
        setSelected((s) => (s === d.chipId ? null : d.chipId));
        return;
      }
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const slotEl = el?.closest('[data-slot]');
      if (slotEl) placeChip(d.chipId, Number(slotEl.getAttribute('data-slot')));
      else if (el?.closest('[data-bank]')) placeChip(d.chipId, null);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
    };
  }, []);

  const startDrag = (e: React.PointerEvent, chipId: number) => {
    if (locked) return;
    e.preventDefault();
    drag.current = { chipId, startX: e.clientX, startY: e.clientY, moved: false };
  };

  const tapSlot = (slot: number) => {
    if (locked) return;
    if (selected !== null) placeChip(selected, slot);
  };

  const allFilled = placed.every((p) => p !== null);

  const check = () => {
    if (!allFilled || locked) return;
    const bad = new Set<number>();
    placed.forEach((chipId, slot) => {
      if (chipId === null || chipById(chipId).item.label !== q.pairs[slot].right.label) bad.add(slot);
    });
    if (bad.size === 0) {
      setRightAll(true);
      onSubmit(true);
      return;
    }
    setWrongSlots(bad);
    onSubmit(false);
    // send the wrong ones back to the bank after a moment
    setTimeout(() => {
      setPlaced((prev) => prev.map((v, i) => (bad.has(i) ? null : v)));
      setWrongSlots(new Set());
    }, 1000);
  };

  const renderChip = (c: Chip, extra = '') => (
    <button
      key={c.id}
      type="button"
      className={`chip ${selected === c.id ? 'chip--selected' : ''} ${floating?.chipId === c.id ? 'chip--ghost' : ''} ${extra}`}
      onPointerDown={(e) => startDrag(e, c.id)}
      disabled={locked}
    >
      <ItemView item={c.item} />
    </button>
  );

  return (
    <div className="match">
      <div className="match__rows">
        {q.pairs.map((p, slot) => {
          const chipId = placed[slot];
          const isWrong = wrongSlots.has(slot);
          return (
            <div key={slot} className="match__row">
              <div className="match__left">
                <ItemView item={p.left} />
              </div>
              <span className="match__arrow" aria-hidden="true">
                ←
              </span>
              <div
                className={`slot ${chipId !== null ? 'slot--full' : ''} ${isWrong ? 'is-wrong' : ''} ${rightAll ? 'is-right' : ''} ${selected !== null && chipId === null ? 'slot--ready' : ''}`}
                data-slot={slot}
                onClick={() => tapSlot(slot)}
              >
                {reveal ? (
                  <span className="chip chip--reveal">
                    <ItemView item={p.right} />
                  </span>
                ) : chipId !== null ? (
                  renderChip(chipById(chipId))
                ) : (
                  <span className="slot__empty">?</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {!locked && (
        <>
          <div className="match__bank" data-bank onClick={(e) => {
              if ((e.target as Element).closest('.chip')) return;
              if (selected !== null) placeChip(selected, null);
            }}
          >
            {inBank.length === 0 ? <span className="match__bank-empty">כל התשובות במקום!</span> : inBank.map((c) => renderChip(c))}
          </div>
          <button type="button" className="btn btn--go" onClick={check} disabled={!allFilled}>
            ✓ בדיקה
          </button>
        </>
      )}
      {floating && (
        <div className="chip chip--floating" style={{ left: floating.x, top: floating.y }} aria-hidden="true">
          <ItemView item={chipById(floating.chipId).item} />
        </div>
      )}
    </div>
  );
}
