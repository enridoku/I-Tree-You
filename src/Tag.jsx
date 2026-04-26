import { C, TAG_COLORS } from './data.js';

export default function Tag({ label }) {
  const colors = TAG_COLORS[label] || { bg: C.greenLight, text: C.green };
  return (
    <span style={{
      display: 'inline-block',
      padding: '3px 10px',
      borderRadius: 99,
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.02em',
      background: colors.bg,
      color: colors.text,
    }}>{label}</span>
  );
}
