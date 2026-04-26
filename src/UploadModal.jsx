import { useState, useRef, useEffect } from 'react';
import { C, TAG_COLORS, ALL_TAGS } from './data.js';
import { addNewTree, uploadTreePhoto } from './firestore.js';

export default function UploadModal({ onClose, onTreeAdded }) {
  const [form, setForm] = useState({ name: '', location: '', desc: '', tags: [] });
  const [photo, setPhoto] = useState(null);         // File object
  const [photoPreview, setPhotoPreview] = useState(null); // object URL for preview
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const draggingRef = useRef(false);
  const dragYRef = useRef(0);
  const dragStartRef = useRef(null);
  const fileInputRef = useRef(null);

  // Revoke the object URL when it changes or the component unmounts
  useEffect(() => {
    return () => { if (photoPreview) URL.revokeObjectURL(photoPreview); };
  }, [photoPreview]);

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const dismissWithSlide = () => {
    setDragY(window.innerHeight);
    setTimeout(onClose, 300);
  };

  const toggleTag = (t) => setForm(f => ({
    ...f,
    tags: f.tags.includes(t) ? f.tags.filter(x => x !== t) : [...f.tags, t],
  }));

  const submit = async () => {
    if (!form.name.trim() || submitting) return;
    setSubmitting(true);
    setUploadError(null);
    try {
      let photoUrl = null;
      if (photo) {
        // Race the upload against a 30-second timeout so the button never hangs forever
        photoUrl = await Promise.race([
          uploadTreePhoto(photo),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Upload timed out — check your connection and try again.')), 30000)
          ),
        ]);
      }

      await addNewTree({
        name: form.name.trim(),
        location: form.location.trim(),
        description: form.desc.trim(),
        tags: form.tags,
        photoUrl,
        votes: 0,
        species: '',
        type: '',
        bloomMonth: '',
        bloomNote: '',
        facts: [],
        hue: 130, sat: 0.10, lit: 0.40,
        gallery: [
          { litOffset: 0,     hueOffset: 0,  label: 'Main view' },
          { litOffset: 0.08,  hueOffset: 10, label: 'Bright day' },
          { litOffset: -0.08, hueOffset: -5, label: 'Evening' },
          { litOffset: 0.04,  hueOffset: 20, label: 'Golden hour' },
        ],
      });
      setSubmitted(true);
      onTreeAdded?.();
      setTimeout(onClose, 1800);
    } catch (err) {
      console.error('Upload error:', err);
      setUploadError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '11px 13px',
    borderRadius: 10,
    border: `1.5px solid ${C.border}`,
    background: C.bg,
    color: C.text,
    fontSize: 14,
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'border-color 0.15s',
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'absolute', inset: 0,
        background: 'oklch(0.10 0.01 100 / 0.45)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'flex-end',
        borderRadius: 'inherit',
        overflow: 'hidden',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          background: C.surface,
          borderRadius: '20px 20px 0 0',
          padding: '0 0 32px',
          maxHeight: '88%',
          overflowY: isDragging ? 'hidden' : 'auto',
          boxShadow: '0 -4px 30px oklch(0.15 0.01 100 / 0.18)',
          transform: `translateY(${dragY}px)`,
          transition: isDragging ? 'none' : 'transform 0.28s cubic-bezier(0.32,0.72,0,1)',
        }}
      >
        {/* Handle — drag target */}
        <div
          onPointerDown={(e) => {
            dragStartRef.current = e.clientY;
            draggingRef.current = true;
            setIsDragging(true);
            e.currentTarget.setPointerCapture(e.pointerId);
          }}
          onPointerMove={(e) => {
            if (!draggingRef.current) return;
            const dy = Math.max(0, e.clientY - dragStartRef.current);
            dragYRef.current = dy;
            setDragY(dy);
          }}
          onPointerUp={() => {
            draggingRef.current = false;
            setIsDragging(false);
            if (dragYRef.current > 100) dismissWithSlide();
            else { setDragY(0); dragYRef.current = 0; }
            dragStartRef.current = null;
          }}
          style={{
            display: 'flex', justifyContent: 'center',
            padding: '14px 0',
            cursor: 'grab',
            touchAction: 'none',
            userSelect: 'none',
          }}
        >
          <div style={{ width: 36, height: 4, borderRadius: 99, background: C.border }} />
        </div>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px 12px' }}>
          <h3 style={{ fontFamily: '"DM Serif Display", serif', fontSize: 20, fontWeight: 400, color: C.text }}>
            Share a tree
          </h3>
          <button onClick={onClose} style={{
            width: 30, height: 30, borderRadius: 99, border: 'none',
            background: C.bgSubtle, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: C.textMid, fontSize: 16, fontFamily: 'inherit',
          }}>✕</button>
        </div>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>🌳</div>
            <p style={{ fontFamily: '"DM Serif Display", serif', fontSize: 20, color: C.text, marginBottom: 8 }}>
              Tree submitted!
            </p>
            <p style={{ fontSize: 14, color: C.textMid }}>Thanks for sharing Berlin&apos;s beauty.</p>
          </div>
        ) : (
          <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Photo picker */}
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                height: 160, borderRadius: 12,
                overflow: 'hidden',
                background: C.bgSubtle,
                border: photoPreview ? 'none' : `2px dashed ${C.border}`,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: 6, cursor: 'pointer',
                color: C.textLight,
                position: 'relative',
              }}
            >
              {photoPreview ? (
                <>
                  <img
                    src={photoPreview}
                    alt="preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                  {/* Tap-to-change overlay */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'oklch(0 0 0 / 0.28)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{ color: '#fff', fontSize: 12, fontWeight: 600, letterSpacing: '0.04em' }}>
                      TAP TO CHANGE
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="3"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <path d="m21 15-5-5L5 21"/>
                  </svg>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>Tap to add photo</span>
                </>
              )}
            </div>

            {/* Hidden file input — opens camera roll + camera on mobile */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handlePhotoChange}
            />

            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: C.textMid, display: 'block', marginBottom: 5, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Tree name
              </label>
              <input
                style={inputStyle}
                placeholder="e.g. Ancient oak in Tiergarten"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: C.textMid, display: 'block', marginBottom: 5, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Location
              </label>
              <input
                style={inputStyle}
                placeholder="e.g. Tiergarten, Mitte"
                value={form.location}
                onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
              />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: C.textMid, display: 'block', marginBottom: 5, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Why is it special?
              </label>
              <textarea
                style={{ ...inputStyle, height: 80, resize: 'none' }}
                placeholder="Tell us what makes this tree beautiful…"
                value={form.desc}
                onChange={e => setForm(f => ({ ...f, desc: e.target.value }))}
              />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: C.textMid, display: 'block', marginBottom: 8, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Tags
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                {ALL_TAGS.map(t => {
                  const active = form.tags.includes(t);
                  const colors = TAG_COLORS[t] || { bg: C.greenLight, text: C.green };
                  return (
                    <button
                      key={t}
                      onClick={() => toggleTag(t)}
                      style={{
                        padding: '5px 12px',
                        borderRadius: 99,
                        border: active ? `1.5px solid ${colors.text}` : `1.5px solid ${C.border}`,
                        background: active ? colors.bg : C.surface,
                        color: active ? colors.text : C.textMid,
                        fontSize: 12,
                        fontWeight: 600,
                        fontFamily: 'inherit',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                    >{t}</button>
                  );
                })}
              </div>
            </div>

            {uploadError && (
              <p style={{ fontSize: 12, color: C.heartRed, textAlign: 'center', lineHeight: 1.5 }}>
                {uploadError}
              </p>
            )}

            <button
              onClick={submit}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: 14,
                border: 'none',
                background: (form.name.trim() && !submitting) ? C.love : 'oklch(0.80 0.04 150)',
                color: C.loveText,
                fontSize: 15,
                fontWeight: 600,
                fontFamily: 'inherit',
                cursor: (form.name.trim() && !submitting) ? 'pointer' : 'not-allowed',
                marginTop: 4,
                transition: 'background 0.2s',
              }}
            >{submitting ? 'Uploading…' : 'Upload tree 🌳'}</button>
          </div>
        )}
      </div>
    </div>
  );
}
