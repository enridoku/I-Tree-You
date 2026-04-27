import { useState, useRef } from 'react';
import { C } from './data.js';
import Tag from './Tag.jsx';
import TreeIllustration from './TreeIllustration.jsx';

export default function TreeCard({ tree, onLove, onSkip, onTap }) {
  const [pressed, setPressed] = useState(null);
  const [exitDir, setExitDir] = useState(null);
  const [drag, setDrag] = useState({ x: 0, y: 0, dragging: false });
  const dragStart = useRef(null);

  const triggerExit = (dir) => {
    setExitDir(dir);
    setTimeout(() => {
      dir === 'love' ? onLove() : onSkip();
    }, 350);
  };

  const onPointerDown = (e) => {
    dragStart.current = { x: e.clientX, y: e.clientY };
    setDrag({ x: 0, y: 0, dragging: true });
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!drag.dragging || exitDir) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setDrag({ x: dx, y: dy, dragging: true });
  };

  const onPointerUp = (e) => {
    if (!drag.dragging) return;
    const dx = drag.x;
    const dy = drag.y;
    setDrag({ x: 0, y: 0, dragging: false });
    if (Math.abs(dx) < 10 && Math.abs(dy) < 10) { onTap && onTap(); return; }
    if (dx > 80) triggerExit('love');
    else if (dx < -80) triggerExit('skip');
  };

  const rotation = exitDir
    ? (exitDir === 'love' ? 15 : -15)
    : drag.x * 0.08;

  const tx = exitDir === 'love' ? '130%' : exitDir === 'skip' ? '-130%' : `${drag.x}px`;
  const ty = exitDir ? '0px' : `${drag.y * 0.3}px`;

  const swipeProgress = Math.min(Math.abs(drag.x) / 80, 1);
  const showLoveHint = drag.x > 30;
  const showSkipHint = drag.x < -30;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        style={{
          background: C.surface,
          borderRadius: 20,
          overflow: 'hidden',
          boxShadow: `0 ${4 + swipeProgress * 12}px ${16 + swipeProgress * 24}px oklch(0.18 0.02 100 / ${0.12 + swipeProgress * 0.1}), 0 1px 3px oklch(0.18 0.02 100 / 0.08)`,
          border: `1px solid ${C.border}`,
          transform: `translateX(${tx}) translateY(${ty}) rotate(${rotation}deg)`,
          transition: exitDir ? 'transform 0.35s cubic-bezier(0.4,0,0.2,1)' : drag.dragging ? 'none' : 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1)',
          cursor: drag.dragging ? 'grabbing' : 'grab',
          userSelect: 'none',
          touchAction: 'none',
        }}
      >
        {/* Image */}
        <div style={{ width: '100%', height: 240, background: C.bgSubtle, position: 'relative', overflow: 'hidden' }}>
          {tree.photoUrl
            ? <img src={tree.photoUrl} alt={tree.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            : <TreeIllustration hue={tree.hue} sat={tree.sat} lit={tree.lit} id={tree.id} />
          }

          {(showLoveHint || exitDir === 'love') && (
            <div style={{
              position: 'absolute', inset: 0,
              background: `oklch(0.60 0.12 150 / ${Math.min(swipeProgress * 0.5, 0.4)})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.1s',
            }}>
              <span style={{ fontSize: 64, opacity: swipeProgress, filter: 'drop-shadow(0 2px 8px oklch(0 0 0 / 0.2))' }}>💚</span>
            </div>
          )}
          {(showSkipHint || exitDir === 'skip') && (
            <div style={{
              position: 'absolute', inset: 0,
              background: `oklch(0.50 0.02 100 / ${Math.min(swipeProgress * 0.4, 0.3)})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.1s',
            }}>
              <span style={{ fontSize: 64, opacity: swipeProgress, filter: 'drop-shadow(0 2px 8px oklch(0 0 0 / 0.2))' }}>👋</span>
            </div>
          )}

          {showLoveHint && (
            <div style={{
              position: 'absolute', top: 16, left: 16,
              background: C.love, color: C.loveText,
              padding: '4px 12px', borderRadius: 99,
              fontSize: 12, fontWeight: 700,
              opacity: swipeProgress, transform: 'rotate(-8deg)',
              boxShadow: '0 2px 8px oklch(0.48 0.14 150 / 0.4)',
            }}>LOVE IT</div>
          )}
          {showSkipHint && (
            <div style={{
              position: 'absolute', top: 16, right: 16,
              background: C.skip, color: C.skipText,
              border: `1.5px solid ${C.border}`,
              padding: '4px 12px', borderRadius: 99,
              fontSize: 12, fontWeight: 700,
              opacity: swipeProgress, transform: 'rotate(8deg)',
            }}>SKIP</div>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: '16px 18px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 }}>
            <h2 style={{ fontFamily: '"DM Serif Display", serif', fontSize: 22, fontWeight: 400, color: C.text, lineHeight: 1.2 }}>
              {tree.name}
            </h2>
            <span style={{ fontSize: 12, color: C.textLight, whiteSpace: 'nowrap', marginLeft: 8, marginTop: 4 }}>
              {tree.votes} 💚
            </span>
          </div>
          <p style={{ fontSize: 12, color: C.textMid, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 4 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
              <circle cx="12" cy="9" r="2.5"/>
            </svg>
            {tree.location}
          </p>
          <p style={{ fontSize: 13.5, color: C.textMid, lineHeight: 1.6, marginBottom: 12 }}>
            {tree.description}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {tree.tags.map(t => <Tag key={t} label={t} />)}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 12 }}>
        <button
          onPointerDown={() => setPressed('skip')}
          onPointerUp={() => { setPressed(null); triggerExit('skip'); }}
          style={{
            flex: 1,
            padding: '14px 0',
            borderRadius: 14,
            border: `1.5px solid ${C.border}`,
            background: pressed === 'skip' ? 'oklch(0.88 0.005 100)' : C.skip,
            color: C.skipText,
            fontSize: 15,
            fontWeight: 600,
            fontFamily: 'inherit',
            cursor: 'pointer',
            transition: 'background 0.1s, transform 0.1s',
            transform: pressed === 'skip' ? 'scale(0.97)' : 'scale(1)',
            letterSpacing: '-0.01em',
          }}
        >← Skip</button>
        <button
          onPointerDown={() => setPressed('love')}
          onPointerUp={() => { setPressed(null); triggerExit('love'); }}
          style={{
            flex: 1,
            padding: '14px 0',
            borderRadius: 14,
            border: 'none',
            background: pressed === 'love' ? 'oklch(0.40 0.14 150)' : C.love,
            color: C.loveText,
            fontSize: 15,
            fontWeight: 600,
            fontFamily: 'inherit',
            cursor: 'pointer',
            transition: 'background 0.1s, transform 0.1s',
            transform: pressed === 'love' ? 'scale(0.97)' : 'scale(1)',
            letterSpacing: '-0.01em',
            boxShadow: '0 2px 12px oklch(0.48 0.14 150 / 0.35)',
          }}
        >💚 Love it</button>
      </div>
    </div>
  );
}
