import { useState, useRef } from 'react';
import { C } from './data.js';
import TreeCard from './TreeCard.jsx';

export default function SwipeScreen({ trees, setTrees, onUpload, onShowDetail }) {
  const [idx, setIdx] = useState(0);
  const [loved, setLoved] = useState(new Set());
  const [allDone, setAllDone] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(false);

  const vertStart = useRef(null);

  const onVertDown = (e) => {
    vertStart.current = { y: e.clientY ?? e.touches?.[0]?.clientY };
  };
  const onVertUp = (e) => {
    if (!vertStart.current) return;
    const endY = e.clientY ?? e.changedTouches?.[0]?.clientY;
    const dy = vertStart.current.y - endY;
    vertStart.current = null;
    if (dy > 50) setCtaVisible(true);
    if (dy < -50) setCtaVisible(false);
  };

  const current = trees[idx];

  const advance = () => {
    if (idx + 1 >= trees.length) setAllDone(true);
    else setIdx(i => i + 1);
  };

  const onLove = () => {
    setTrees(prev => prev.map(t => t.id === current.id ? { ...t, votes: t.votes + 1 } : t));
    setLoved(s => new Set([...s, current.id]));
    advance();
  };

  if (allDone) return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: 32, gap: 16,
    }}>
      <div style={{ fontSize: 56 }}>🌳</div>
      <p style={{ fontFamily: '"DM Serif Display", serif', fontSize: 22, color: C.text, textAlign: 'center' }}>
        You&apos;ve seen all the trees!
      </p>
      <p style={{ fontSize: 14, color: C.textMid, textAlign: 'center' }}>
        You loved {loved.size} tree{loved.size !== 1 ? 's' : ''} this session.
      </p>
      <button
        onClick={() => { setIdx(0); setAllDone(false); setLoved(new Set()); }}
        style={{
          padding: '12px 28px', borderRadius: 12, border: 'none',
          background: C.love, color: C.loveText,
          fontSize: 14, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
        }}
      >Start over</button>
    </div>
  );

  return (
    <div
      onPointerDown={onVertDown}
      onPointerUp={onVertUp}
      style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}
    >
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 16px 0' }}>
        {loved.size > 0 && (
          <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'flex-end' }}>
            <p style={{ fontSize: 12, color: C.green, fontWeight: 600 }}>
              {loved.size} loved 💚
            </p>
          </div>
        )}

        <TreeCard
          key={current.id}
          tree={current}
          onLove={onLove}
          onSkip={advance}
          onTap={() => onShowDetail(current)}
        />

        {/* Swipe-up hint */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          padding: '12px 0 16px',
          opacity: ctaVisible ? 0 : 0.45,
          transition: 'opacity 0.3s',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.textLight} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19V5M5 12l7-7 7 7"/>
          </svg>
          <span style={{ fontSize: 11, color: C.textLight, fontWeight: 500 }}>Swipe up to share a tree</span>
        </div>
      </div>

      {/* Upload CTA */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        transform: ctaVisible ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.32s cubic-bezier(0.32,0.72,0,1)',
        background: C.surface,
        borderTop: `1px solid ${C.border}`,
        borderRadius: '20px 20px 0 0',
        padding: '12px 20px 24px',
        boxShadow: '0 -4px 24px oklch(0.15 0.01 100 / 0.12)',
        zIndex: 10,
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
          <div style={{ width: 36, height: 4, borderRadius: 99, background: C.border }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 2 }}>Found a beautiful tree?</p>
            <p style={{ fontSize: 12, color: C.textMid }}>Share it with Berlin 🌳</p>
          </div>
          <button
            onClick={onUpload}
            style={{
              padding: '10px 18px',
              borderRadius: 12,
              border: 'none',
              background: C.love,
              color: C.loveText,
              fontSize: 13,
              fontWeight: 600,
              fontFamily: 'inherit',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 10px oklch(0.48 0.14 150 / 0.3)',
            }}
          >Upload photo</button>
        </div>
        <button
          onClick={() => setCtaVisible(false)}
          style={{
            position: 'absolute', top: 16, right: 16,
            width: 26, height: 26, borderRadius: 99,
            border: 'none', background: C.bgSubtle,
            color: C.textMid, fontSize: 13,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'inherit',
          }}
        >✕</button>
      </div>
    </div>
  );
}
