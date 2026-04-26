import { useState, useEffect } from 'react';
import { C } from './data.js';
import { loadAllTrees } from './firestore.js';
import SwipeScreen from './SwipeScreen.jsx';
import Leaderboard from './Leaderboard.jsx';
import TreeDetail from './TreeDetail.jsx';
import UploadModal from './UploadModal.jsx';

export default function App() {
  const [tab, setTab] = useState('swipe');
  const [showUpload, setShowUpload] = useState(false);
  const [trees, setTrees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTree, setSelectedTree] = useState(null);

  const fetchTrees = () => {
    setLoading(true);
    loadAllTrees()
      .then(data => { setTrees(data); setLoading(false); })
      .catch(err => { console.error(err); setError('Could not load trees.'); setLoading(false); });
  };

  useEffect(() => { fetchTrees(); }, []);

  const TabBtn = ({ id, label }) => (
    <button
      onClick={() => setTab(id)}
      style={{
        flex: 1,
        padding: '12px 0',
        border: 'none',
        background: 'transparent',
        color: tab === id ? C.green : C.textLight,
        fontFamily: 'inherit',
        fontSize: 13,
        fontWeight: tab === id ? 700 : 500,
        cursor: 'pointer',
        borderBottom: `2px solid ${tab === id ? C.green : 'transparent'}`,
        transition: 'all 0.15s',
        letterSpacing: '-0.01em',
      }}
    >{label}</button>
  );

  const renderContent = () => {
    if (loading) return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: C.textLight, fontSize: 14 }}>Loading trees…</p>
      </div>
    );
    if (error) return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        <p style={{ color: C.textMid, fontSize: 14 }}>{error}</p>
        <button onClick={fetchTrees} style={{ padding: '10px 20px', borderRadius: 10, border: 'none', background: C.love, color: C.loveText, fontSize: 13, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer' }}>
          Try again
        </button>
      </div>
    );
    if (tab === 'swipe') return (
      <SwipeScreen
        trees={trees}
        setTrees={setTrees}
        onUpload={() => setShowUpload(true)}
        onShowDetail={setSelectedTree}
      />
    );
    return <Leaderboard trees={trees} onShowDetail={setSelectedTree} />;
  };

  return (
    <div style={{
      width: '100%',
      height: '100dvh',
      background: C.bg,
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Tab bar */}
      <div style={{
        display: 'flex',
        background: C.surface,
        borderBottom: `1px solid ${C.border}`,
        flexShrink: 0,
      }}>
        <TabBtn id="swipe" label="🌿 Discover" />
        <TabBtn id="leaderboard" label="🏆 Top Trees" />
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', background: C.bg }}>
        {renderContent()}
      </div>

      {selectedTree && <TreeDetail tree={selectedTree} onClose={() => setSelectedTree(null)} />}
      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onTreeAdded={fetchTrees}
        />
      )}
    </div>
  );
}
