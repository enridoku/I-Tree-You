export default function TreeIllustration({ hue = 140, sat = 0.12, lit = 0.35, id }) {
  const darkTone  = `oklch(${(lit - 0.08).toFixed(2)} ${sat} ${hue})`;
  const midTone   = `oklch(${lit.toFixed(2)} ${sat} ${hue})`;
  const lightTone = `oklch(${(lit + 0.10).toFixed(2)} ${(sat - 0.03).toFixed(2)} ${hue})`;
  const skyLit    = `oklch(${(lit + 0.48).toFixed(2)} ${(sat * 0.4).toFixed(2)} ${hue + 10})`;
  const skyDark   = `oklch(${(lit + 0.38).toFixed(2)} ${(sat * 0.3).toFixed(2)} ${hue + 15})`;
  const trunkCol  = `oklch(0.42 0.07 65)`;
  const groundCol = `oklch(${(lit + 0.20).toFixed(2)} ${(sat * 0.5).toFixed(2)} ${hue - 5})`;

  const variant = id % 3;

  return (
    <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', display: 'block' }}>
      <defs>
        <linearGradient id={`sky-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={skyDark} />
          <stop offset="100%" stopColor={skyLit} />
        </linearGradient>
        <radialGradient id={`canopy-${id}`} cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor={lightTone} />
          <stop offset="60%" stopColor={midTone} />
          <stop offset="100%" stopColor={darkTone} />
        </radialGradient>
      </defs>
      <rect width="400" height="300" fill={`url(#sky-${id})`} />
      <ellipse cx="200" cy="285" rx="220" ry="30" fill={groundCol} opacity="0.5" />

      {variant === 0 && <>
        <rect x="185" y="195" width="30" height="80" rx="4" fill={trunkCol} />
        <ellipse cx="200" cy="165" rx="90" ry="75" fill={`url(#canopy-${id})`} />
        <ellipse cx="155" cy="185" rx="55" ry="45" fill={darkTone} opacity="0.5" />
        <ellipse cx="245" cy="180" rx="50" ry="42" fill={darkTone} opacity="0.4" />
        <ellipse cx="200" cy="130" rx="65" ry="55" fill={lightTone} opacity="0.35" />
      </>}

      {variant === 1 && <>
        <rect x="189" y="200" width="22" height="78" rx="3" fill={trunkCol} />
        <polygon points="200,60 145,210 255,210" fill={midTone} />
        <polygon points="200,90 138,220 262,220" fill={darkTone} opacity="0.4" />
        <polygon points="200,80 152,190 248,190" fill={lightTone} opacity="0.5" />
        <polygon points="200,50 158,170 242,170" fill={midTone} opacity="0.8" />
        <polygon points="200,30 163,155 237,155" fill={lightTone} opacity="0.6" />
      </>}

      {variant === 2 && <>
        <rect x="192" y="190" width="16" height="85" rx="3" fill={trunkCol} />
        {[[-70,145,-90,240],[-40,130,-55,230],[0,120,0,235],[40,130,55,230],[70,145,90,240]].map(([bx,by,ex,ey],i) => (
          <path key={i} d={`M200,190 Q${200+bx},${by} ${200+ex},${ey}`}
            stroke={darkTone} strokeWidth="10" fill="none" opacity="0.7" strokeLinecap="round" />
        ))}
        <ellipse cx="200" cy="155" rx="100" ry="55" fill={`url(#canopy-${id})`} opacity="0.9" />
        <ellipse cx="200" cy="145" rx="65" ry="38" fill={lightTone} opacity="0.4" />
      </>}

      <rect width="400" height="300" fill="oklch(0 0 0 / 0.08)" style={{ mixBlendMode: 'multiply' }} />
    </svg>
  );
}
