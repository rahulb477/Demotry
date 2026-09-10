import React, { useState } from 'react';
import {
  Gamepad2,
  MapPin,
  Trophy,
  Crosshair,
  Calendar,
  X,
} from 'lucide-react';
import { Tournament, GameMode } from '../types';
import { EmptyState } from '../components/EmptyState';

interface TournamentsProps {
  tournaments: Record<string, Tournament>;
  modes: Record<string, GameMode>;
  selectedModeId: string | null;
  onClearMode: () => void;
  currentUid: string;
  onNavigate: (page: string, data?: any) => void;
  onJoinMatch: (t: Tournament) => void;
}

export const Tournaments: React.FC<TournamentsProps> = ({
  tournaments,
  modes,
  selectedModeId,
  onClearMode,
  currentUid,
  onNavigate,
  onJoinMatch,
}) => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'live' | 'completed'>('upcoming');

  const selectedModeName = selectedModeId ? modes[selectedModeId]?.name : null;

  const filteredList = (Object.entries(tournaments) as [string, Tournament][]).filter(([_, t]) => {
    // Tab filter
    if (activeTab === 'upcoming' && t.status !== 'upcoming') return false;
    if (activeTab === 'live' && t.status !== 'live' && t.status !== 'ongoing') return false;
    if (activeTab === 'completed' && t.status !== 'completed') return false;

    // Mode filter
    if (selectedModeId && t.modeId !== selectedModeId) return false;

    return true;
  });

  const formatDate = (ts: number) => {
    if (!ts) return '';
    return new Date(ts).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="page active" id="tournamentsPage">
      {selectedModeName && (
        <div
          className="flex items-center justify-between p-3 mb-4 rounded-xl"
          style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
        >
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Filtered by: <strong>{selectedModeName}</strong></span>
          </div>
          <button
            onClick={onClearMode}
            className="text-xs px-2 py-1 bg-white/10 rounded hover:bg-white/20 flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            <span>Clear</span>
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="tab-container" id="tournamentTabs">
        <div
          className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming
        </div>
        <div
          className={`tab-btn ${activeTab === 'live' ? 'active' : ''}`}
          onClick={() => setActiveTab('live')}
        >
          Ongoing
        </div>
        <div
          className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          Completed
        </div>
      </div>

      <div id="tournamentsList">
        {filteredList.length === 0 ? (
          <EmptyState
            icon="gamepad"
            title={`No ${activeTab} matches found`}
            message="Check back soon or explore other game modes."
          />
        ) : (
          filteredList.map(([id, tr]) => {
            const filled = tr.filledSlots || 0;
            const max = tr.maxSlots || 100;
            const pct = Math.min((filled / max) * 100, 100);
            const isFull = filled >= max;
            const isJoined = !!(tr.participants && tr.participants[currentUid]);
            const feeText = tr.entryFee > 0 ? `₹${tr.entryFee}` : 'FREE';

            let btnText = `${feeText} JOIN`;
            let btnClass = '';
            if (activeTab === 'completed') {
              btnText = 'RESULTS';
              btnClass = 'full';
            } else if (activeTab === 'live') {
              btnText = isJoined ? 'PLAYING' : 'LIVE';
              btnClass = 'joined';
            } else {
              if (isJoined) {
                btnText = 'JOINED';
                btnClass = 'joined';
              } else if (isFull) {
                btnText = 'FULL';
                btnClass = 'full';
              }
            }

            return (
              <div
                key={id}
                className="tournament-card"
                onClick={() => onNavigate('tournamentDetail', id)}
              >
                <div className="tc-banner-container">
                  <img
                    src={tr.bannerUrl || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80'}
                    alt={tr.name}
                    loading="lazy"
                  />
                  <div className="tc-badge-container">
                    <div className="tc-badge">
                      <Gamepad2 className="w-3 h-3 mr-1" />
                      <span>{tr.modeName || tr.game}</span>
                    </div>
                    <div className="tc-badge">
                      <MapPin className="w-3 h-3 mr-1" />
                      <span>{tr.map || 'Bermuda'}</span>
                    </div>
                  </div>
                </div>

                <div className="tc-body">
                  <div className="tc-title">{tr.name}</div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '12px',
                      fontSize: '0.75rem',
                      color: 'var(--text3)',
                    }}
                  >
                    <span className="flex items-center gap-1">
                      <Trophy className="w-3.5 h-3.5 text-warning" />
                      <span>₹{tr.prizePool || 0} Pool</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Crosshair className="w-3.5 h-3.5 text-danger" />
                      <span>₹{tr.perKillPrize || 0}/Kill</span>
                    </span>
                  </div>

                  <div className="tc-slots">
                    <div className="tc-slots-bar">
                      <div className="tc-slots-fill" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="tc-slots-text">
                      <span>{filled}/{max} Slots Filled</span>
                      <span>{Math.round(pct)}%</span>
                    </div>
                  </div>

                  <div className="tc-footer">
                    <div className="tc-time">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      <span>{formatDate(tr.matchTime)}</span>
                    </div>
                    <button
                      className={`tc-join-btn-premium ${btnClass}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (activeTab === 'upcoming' && !isJoined && !isFull) {
                          onJoinMatch(tr);
                        } else {
                          onNavigate('tournamentDetail', id);
                        }
                      }}
                      disabled={activeTab === 'upcoming' && isFull && !isJoined}
                    >
                      {btnText}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
