import { C } from './data.js';
import TreeIllustration from './TreeIllustration.jsx';

export default function Leaderboard({ trees, onShowDetail }) {
  const sorted = [...trees].sort((a, b) => b.votes - a.votes);

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '4px 0 0' }}>
      <div style={{ padding: '12px 20px 16px', borderBottom: `1px solid ${C.border}` }}>
        <p style={{ fontSize: 12, color: C.textLight, textAlign: 'center' }}>
          Top trees voted by Berliners
        </p>
      </div>

      <div style={{ padding: '8px 16px' }}>
        {sorted.map((tree, i) => (
          <div
            key={tree.id}
            onClick={() => onShowDetail && onShowDetail(tree)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 0',
              borderBottom: i < sorted.length - 1 ? `1px solid ${C.border}` : 'none',
              cursor: 'pointer',
            }}
          >
            <div style={{ width: 28, textAlign: 'center', flexShrink: 0 }}>
              {i < 3 ? (
                <span style={{ fontSize: 18 }}>{['🥇','🥈','🥉'][i]}</span>
              ) : (
                <span style={{ fontSize: 13, fontWeight: 700, color: C.textLight }}>{i + 1}</span>
              )}
            </div>

            <div style={{
              width: 56, height: 56,
              borderRadius: 12,
              overflow: 'hidden',
              flexShrink: 0,
              border: `1px solid ${C.border}`,
            }}>
              <TreeIllustration hue={tree.hue} sat={tree.sat} lit={tree.lit} id={tree.id} />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                fontWeight: 600,
                fontSize: 14,
                color: C.text,
                marginBottom: 2,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>{tree.name}</p>
              <p style={{
                fontSize: 11.5,
                color: C.textLight,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>{tree.location}</p>
            </div>

            <div style={{ flexShrink: 0, textAlign: 'right' }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: C.green }}>{tree.votes}</p>
              <p style={{ fontSize: 10, color: C.textLight }}>💚 votes</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
