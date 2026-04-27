import { useState, useEffect, useRef } from 'react';
import { C } from './data.js';
import Tag from './Tag.jsx';
import TreeIllustration from './TreeIllustration.jsx';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const EASING = 'cubic-bezier(0.32,0.72,0,1)';

const PIN = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.textMid} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
    <circle cx="12" cy="9" r="2.5"/>
  </svg>
);

// Instagram-style gallery indicator
function GalleryIndicator({ idx, total }) {
  if (total <= 1) return null;
  return (
    <div style={{
      position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)',
      display: 'flex', alignItems: 'center', gap: total <= 7 ? 5 : 0,
      background: 'oklch(0 0 0 / 0.42)',
      backdropFilter: 'blur(6px)',
      WebkitBackdropFilter: 'blur(6px)',
      borderRadius: 99,
      padding: total <= 7 ? '5px 9px' : '3px 10px',
      pointerEvents: 'none',
    }}>
      {total <= 7
        ? Array.from({ length: total }, (_, i) => (
            <div key={i} style={{
              width: 6, height: 6, borderRadius: '50%',
              background: i === idx ? '#fff' : 'rgba(255,255,255,0.38)',
              transition: 'background 0.2s',
            }} />
          ))
        : <span style={{ color: '#fff', fontSize: 11, fontWeight: 600, letterSpacing: '0.02em' }}>
            {idx + 1} / {total}
          </span>
      }
    </div>
  );
}

// Normalise both old (photoUrl) and new (photoUrls) data shapes
function getPhotos(tree) {
  if (tree.photoUrls?.length) return tree.photoUrls;
  if (tree.photoUrl) return [tree.photoUrl];
  return [];
}

export default function TreeDetail({ tree, onClose }) {
  const [galleryIdx, setGalleryIdx] = useState(0);
  const [visible, setVisible] = useState(false);
  const [photoExpanded, setPhotoExpanded] = useState(false);
  const [photoIdx, setPhotoIdx] = useState(0);
  const galleryRef = useRef(null);

  useEffect(() => { requestAnimationFrame(() => setVisible(true)); }, []);

  const close = () => { setVisible(false); setTimeout(onClose, 280); };

  const illusGallery = tree.gallery || [{ litOffset: 0, hueOffset: 0, label: 'Main view' }];
  const active  = illusGallery[galleryIdx];
  const adjLit  = Math.max(0.1, Math.min(0.9, tree.lit + (active.litOffset || 0)));
  const adjHue  = tree.hue + (active.hueOffset || 0);
  const bloomIdx = MONTHS.findIndex(m => tree.bloomMonth && tree.bloomMonth.startsWith(m));

  const photos   = getPhotos(tree);
  const hasPhoto = photos.length > 0;
  const canExpand = hasPhoto;

  const onGalleryScroll = () => {
    const el = galleryRef.current;
    if (!el) return;
    setPhotoIdx(Math.round(el.scrollLeft / el.clientWidth));
  };

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 200,
      background: visible ? 'oklch(0.10 0.01 100 / 0.5)' : 'oklch(0.10 0.01 100 / 0)',
      transition: 'background 0.28s',
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
    }} onClick={close}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: C.bg,
          borderRadius: '22px 22px 0 0',
          height: '92%',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          transform: visible ? 'translateY(0)' : 'translateY(100%)',
          transition: `transform 0.30s ${EASING}`,
          boxShadow: '0 -8px 40px oklch(0.10 0.01 100 / 0.18)',
        }}
      >
        {/* ── Hero ── */}
        <div
          onClick={() => canExpand && setPhotoExpanded(p => !p)}
          style={{
            position: 'relative',
            flex: photoExpanded ? '1 0 240px' : '0 0 240px',
            transition: `flex 0.42s ${EASING}`,
            background: C.bgSubtle,
            overflow: 'hidden',
            cursor: canExpand ? 'pointer' : 'default',
          }}
        >
          {hasPhoto ? (
            /* Photo gallery */
            photos.length === 1
              ? <img src={photos[0]} alt={tree.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              : <div
                  ref={galleryRef}
                  onScroll={onGalleryScroll}
                  style={{
                    width: '100%', height: '100%',
                    display: 'flex',
                    overflowX: 'scroll', overflowY: 'hidden',
                    scrollSnapType: 'x mandatory',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    WebkitOverflowScrolling: 'touch',
                  }}
                >
                  {photos.map((url, i) => (
                    <div key={i} style={{ flexShrink: 0, width: '100%', height: '100%', scrollSnapAlign: 'start' }}>
                      <img src={url} alt={`${tree.name} ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </div>
                  ))}
                </div>
          ) : (
            /* SVG illustration */
            <div style={{ position: 'absolute', inset: 0 }}>
              <TreeIllustration hue={adjHue} sat={tree.sat} lit={adjLit} id={tree.id + galleryIdx * 10} />
            </div>
          )}

          {/* Gradient */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 80,
            background: 'linear-gradient(to top, oklch(0.12 0.01 100 / 0.55), transparent)',
            pointerEvents: 'none',
          }} />

          {/* Back */}
          <button onClick={e => { e.stopPropagation(); close(); }} style={{
            position: 'absolute', top: 14, left: 14,
            width: 34, height: 34, borderRadius: 99, border: 'none',
            background: 'oklch(0.10 0.01 100 / 0.45)',
            backdropFilter: 'blur(8px)',
            color: '#fff', fontSize: 18, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'inherit',
          }}>‹</button>

          {/* Votes */}
          <div onClick={e => e.stopPropagation()} style={{
            position: 'absolute', top: 14, right: 14,
            background: 'oklch(0.10 0.01 100 / 0.45)',
            backdropFilter: 'blur(8px)',
            color: '#fff', borderRadius: 99,
            padding: '4px 11px', fontSize: 12, fontWeight: 700,
          }}>{tree.votes} 💚</div>

          {/* Illustration gallery label */}
          {!hasPhoto && (
            <div style={{
              position: 'absolute', bottom: 10, left: 14,
              color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: 600,
              letterSpacing: '0.04em', textTransform: 'uppercase',
              pointerEvents: 'none',
            }}>{active.label}</div>
          )}

          {/* Photo gallery indicator */}
          <GalleryIndicator idx={photoIdx} total={photos.length} />
        </div>

        {/* ── Compact footer (photo trees, expanded) ── */}
        {canExpand && (
          <div style={{
            flexShrink: 0, overflow: 'hidden',
            maxHeight: photoExpanded ? 72 : 0,
            transition: `max-height 0.42s ${EASING}`,
            background: C.surface,
            borderTop: `1px solid ${C.border}`,
          }}>
            <div style={{ padding: '11px 18px 10px' }}>
              {/* Change 1: smaller, non-serif font for name */}
              <p style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 4 }}>
                {tree.name}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                {PIN}
                <span style={{ fontSize: 12, color: C.textMid }}>{tree.location}</span>
              </div>
            </div>
          </div>
        )}

        {/* ── Thumbnail strip (illustration trees only) ── */}
        {!hasPhoto && (
          <div style={{
            display: 'flex', gap: 6, padding: '10px 14px',
            background: C.surface,
            borderBottom: `1px solid ${C.border}`,
            flexShrink: 0,
          }}>
            {illusGallery.map((g, i) => {
              const tLit = Math.max(0.1, Math.min(0.9, tree.lit + (g.litOffset || 0)));
              const tHue = tree.hue + (g.hueOffset || 0);
              return (
                <button key={i} onClick={() => setGalleryIdx(i)} style={{
                  width: 56, height: 42, borderRadius: 8, overflow: 'hidden',
                  border: i === galleryIdx ? `2px solid ${C.green}` : `2px solid transparent`,
                  padding: 0, cursor: 'pointer', flexShrink: 0,
                  transition: 'border-color 0.15s', background: 'none',
                }}>
                  <TreeIllustration hue={tHue} sat={tree.sat} lit={tLit} id={tree.id + i * 10} />
                </button>
              );
            })}
          </div>
        )}

        {/* ── Full scrollable info ── */}
        <div style={{
          flex: 1,
          overflowY: photoExpanded ? 'hidden' : 'auto',
          maxHeight: photoExpanded ? 0 : 600,
          transition: `max-height 0.42s ${EASING}`,
          padding: '18px 18px 32px',
        }}>
          <h2 style={{
            fontFamily: '"DM Serif Display", serif',
            fontSize: 26, fontWeight: 400, color: C.text,
            lineHeight: 1.15, marginBottom: 4,
          }}>{tree.name}</h2>
          <p style={{ fontSize: 12, color: C.textLight, fontStyle: 'italic', marginBottom: 10 }}>
            {tree.species} · {tree.type}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 16 }}>
            {PIN}
            <span style={{ fontSize: 13, color: C.textMid }}>{tree.location}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 18 }}>
            {(tree.facts || []).map((f, i) => (
              <div key={i} style={{
                background: C.surface, border: `1px solid ${C.border}`,
                borderRadius: 12, padding: '10px 12px',
              }}>
                <p style={{ fontSize: 18, marginBottom: 2 }}>{f.icon}</p>
                <p style={{ fontSize: 10, color: C.textLight, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 1 }}>{f.label}</p>
                <p style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{f.value}</p>
              </div>
            ))}
          </div>

          <p style={{ fontSize: 14, color: C.textMid, lineHeight: 1.7, marginBottom: 18 }}>
            {tree.description}
          </p>

          <div style={{
            background: C.surface, border: `1px solid ${C.border}`,
            borderRadius: 14, padding: '14px 14px 12px', marginBottom: 18,
          }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: C.textLight, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 10 }}>
              🌸 Best month to visit
            </p>
            <div style={{ display: 'flex', gap: 3, marginBottom: 10 }}>
              {MONTHS.map((m, i) => {
                const isBloom = i === bloomIdx;
                return (
                  <div key={m} style={{
                    flex: 1, textAlign: 'center', padding: '5px 0', borderRadius: 6,
                    background: isBloom ? C.love : C.bgSubtle,
                    color: isBloom ? C.loveText : C.textLight,
                    fontSize: 8, fontWeight: isBloom ? 700 : 500,
                    transition: 'background 0.2s',
                  }}>{m}</div>
                );
              })}
            </div>
            <p style={{ fontSize: 12.5, color: C.textMid, lineHeight: 1.6, fontStyle: 'italic' }}>
              "{tree.bloomNote}"
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            {(tree.tags || []).map(t => <Tag key={t} label={t} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
