import { useState } from 'react';
import { C, TREES as INITIAL_TREES } from './data.js';
import { IOSDevice } from './IOSFrame.jsx';
import SwipeScreen from './SwipeScreen.jsx';
import Leaderboard from './Leaderboard.jsx';
import TreeDetail from './TreeDetail.jsx';
import UploadModal from './UploadModal.jsx';

export default function App() {
  const [tab, setTab] = useState('swipe');
  const [showUpload, setShowUpload] = useState(false);
  const [trees, setTrees] = useState(INITIAL_TREES);
  const [selectedTree, setSelectedTree] = useState(null);

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

  return (
    <IOSDevice>
      <div style={{
        width: '100%',
        height: '100%',
        background: C.bg,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '14px 20px 0',
          background: C.surface,
          borderBottom: `1px solid ${C.border}`,
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <h1 style={{
              fontFamily: '"DM Serif Display", serif',
              fontSize: 22,
              fontWeight: 400,
              color: C.text,
              letterSpacing: '-0.01em',
            }}>
              I Tree You 🌳
            </h1>
            <span style={{
              fontSize: 11,
              fontWeight: 600,
              color: C.greenMid,
              background: C.greenLight,
              padding: '3px 9px',
              borderRadius: 99,
            }}>Berlin</span>
          </div>
          <div style={{ display: 'flex' }}>
            <TabBtn id="swipe" label="🌿 Discover" />
            <TabBtn id="leaderboard" label="🏆 Top Trees" />
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', background: C.bg }}>
          {tab === 'swipe'
            ? <SwipeScreen trees={trees} setTrees={setTrees} onUpload={() => setShowUpload(true)} onShowDetail={setSelectedTree} />
            : <Leaderboard trees={trees} onShowDetail={setSelectedTree} />
          }
        </div>

        {selectedTree && <TreeDetail tree={selectedTree} onClose={() => setSelectedTree(null)} />}
        {showUpload && <UploadModal onClose={() => setShowUpload(false)} />}
      </div>
    </IOSDevice>
  );
}
