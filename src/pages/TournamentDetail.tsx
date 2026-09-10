import React, { useState } from 'react';
import {
  Gamepad2,
  MapPin,
  Trophy,
  Crosshair,
  Key,
  Copy,
  Check,
  FileText,
  Users,
} from 'lucide-react';
import { Tournament } from '../types';
import { EmptyState } from '../components/EmptyState';

interface TournamentDetailProps {
  tournament: Tournament;
  currentUid: string;
  onJoinMatch: (t: Tournament) => void;
  onCopyText: (text: string, label: string) => void;
}

export const TournamentDetail: React.FC<TournamentDetailProps> = ({
  tournament,
  currentUid,
  onJoinMatch,
  onCopyText,
}) => {
  const [activeTab, setActiveTab] = useState<'desc' | 'players'>('desc');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const isJoined = !!(tournament.participants && tournament.participants[currentUid]);
  const filled = tournament.filledSlots || 0;
  const max = tournament.maxSlots || 100;
  const isFull = filled >= max;

  const participantsList = Object.entries(tournament.participants || {}).map(
    ([uid, p]) => ({ uid, ...(p as any) })
  );

  // If completed, sort by rank
  if (tournament.status === 'completed') {
    participantsList.sort((a, b) => (a.rank || 999) - (b.rank || 999));
  } else {
    participantsList.sort((a, b) => (b.joinedAt || 0) - (a.joinedAt || 0));
  }

  const handleCopy = (val: string, field: string) => {
    onCopyText(val, field);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const showRoomDetails = isJoined && (tournament.roomId || tournament.roomPassword);

  return (
    <div className="page active" id="tournamentDetailPage">
      <div className="detail-banner-wrap">
        <img
          id="detailBanner"
          src={tournament.bannerUrl || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80'}
          alt={tournament.name}
          className="detail-banner"
          loading="lazy"
        />
        <div className="detail-overlay">
          <div className="detail-tags">
            <span className="badge badge-primary flex items-center gap-1">
              <Gamepad2 className="w-3 h-3" />
              <span>{tournament.modeName || tournament.game}</span>
            </span>
            <span className="badge badge-info flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>{tournament.map || 'Bermuda'}</span>
            </span>
            <span className="badge badge-warning">{tournament.type || 'Solo'}</span>
          </div>
          <h2 className="detail-title" id="detailTitle">{tournament.name}</h2>
        </div>
      </div>

      <div className="detail-grid">
        <div className="detail-card">
          <span className="label">Entry Fee</span>
          <span className="value" id="detailEntryFee">
            {tournament.entryFee > 0 ? `₹${tournament.entryFee}` : 'FREE'}
          </span>
        </div>
        <div className="detail-card">
          <span className="label">Prize Pool</span>
          <span className="value text-warning" id="detailPrizePool">
            ₹{tournament.prizePool || 0}
          </span>
        </div>
        <div className="detail-card">
          <span className="label">Per Kill</span>
          <span className="value text-danger" id="detailPerKill">
            ₹{tournament.perKillPrize || 0}
          </span>
        </div>
        <div className="detail-card">
          <span className="label">Slots</span>
          <span className="value" id="detailSlots">
            {filled}/{max}
          </span>
        </div>
      </div>

      {/* Room Details Section */}
      <div id="roomDetailsSection" className="detail-room-card">
        <div className="room-title">
          <Key className="w-4 h-4 text-warning" />
          <span>Custom Room Access</span>
        </div>
        {showRoomDetails ? (
          <div className="room-info-grid">
            <div className="room-item">
              <span className="text-xs text-gray-400">Room ID</span>
              <div className="flex items-center justify-between font-mono font-bold text-white text-base">
                <span>{tournament.roomId || 'Pending'}</span>
                {tournament.roomId && (
                  <button
                    onClick={() => handleCopy(tournament.roomId!, 'Room ID')}
                    className="p-1.5 hover:bg-white/10 rounded"
                  >
                    {copiedField === 'Room ID' ? (
                      <Check className="w-4 h-4 text-success" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                )}
              </div>
            </div>

            <div className="room-item">
              <span className="text-xs text-gray-400">Room Password</span>
              <div className="flex items-center justify-between font-mono font-bold text-white text-base">
                <span>{tournament.roomPassword || 'Pending'}</span>
                {tournament.roomPassword && (
                  <button
                    onClick={() => handleCopy(tournament.roomPassword!, 'Password')}
                    className="p-1.5 hover:bg-white/10 rounded"
                  >
                    {copiedField === 'Password' ? (
                      <Check className="w-4 h-4 text-success" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-xs text-gray-400 leading-relaxed">
            {isJoined
              ? 'Room ID & Password will be published 15 minutes before the match start time.'
              : 'Join this tournament to receive the custom room credentials before match start.'}
          </p>
        )}
      </div>

      {/* Sub Tabs */}
      <div className="tab-container" style={{ margin: '20px 0 15px' }}>
        <div
          className={`tab-btn ${activeTab === 'desc' ? 'active' : ''}`}
          onClick={() => setActiveTab('desc')}
        >
          <FileText className="w-4 h-4 mr-1.5 inline" />
          <span>Description</span>
        </div>
        <div
          className={`tab-btn ${activeTab === 'players' ? 'active' : ''}`}
          onClick={() => setActiveTab('players')}
        >
          <Users className="w-4 h-4 mr-1.5 inline" />
          <span>Participants ({participantsList.length})</span>
        </div>
      </div>

      {activeTab === 'desc' && (
        <div className="detail-rules-card">
          <h4 className="font-bold text-sm mb-2 text-white">Tournament Rules & Guidelines</h4>
          <div className="whitespace-pre-line text-xs text-gray-300 leading-relaxed">
            {tournament.rules ||
              '1. Cheating, hacking, or third-party tools will result in a permanent ban.\n2. Room ID and password are confidential.\n3. Take a screenshot at the end of the match for dispute resolution.'}
          </div>
        </div>
      )}

      {activeTab === 'players' && (
        <div className="participants-table-wrap">
          {participantsList.length === 0 ? (
            <EmptyState
              icon="users"
              title="No participants yet"
              message="Be the first player to register for this match."
            />
          ) : (
            <table className="participants-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Player</th>
                  <th>Game Name / UID</th>
                  {tournament.status === 'completed' && (
                    <>
                      <th>Kills</th>
                      <th>Prize</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {participantsList.map((p, idx) => (
                  <tr key={p.uid} className={p.uid === currentUid ? 'highlight-me' : ''}>
                    <td>
                      {p.rank ? (
                        <span className="rank-badge">#{p.rank}</span>
                      ) : (
                        idx + 1
                      )}
                    </td>
                    <td className="font-semibold text-white">{p.name || 'Player'}</td>
                    <td>
                      <div className="text-xs text-gray-300">{p.gameName || '--'}</div>
                      <div className="text-[10px] text-gray-500">{p.gameUID || ''}</div>
                    </td>
                    {tournament.status === 'completed' && (
                      <>
                        <td className="font-mono">{p.kills || 0}</td>
                        <td className="font-mono text-warning font-bold">
                          {p.prize ? `₹${p.prize}` : '--'}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Fixed bottom Join Bar */}
      {tournament.status === 'upcoming' && (
        <div className="detail-bottom-bar">
          <div>
            <span className="text-xs text-gray-400 block">Entry Fee</span>
            <span className="text-lg font-extrabold text-white">
              {tournament.entryFee > 0 ? `₹${tournament.entryFee}` : 'FREE'}
            </span>
          </div>
          <button
            className={`btn ${isJoined ? 'btn-secondary' : isFull ? 'btn-secondary' : 'btn-primary'}`}
            style={{ width: 'auto', minWidth: '160px' }}
            onClick={() => {
              if (!isJoined && !isFull) onJoinMatch(tournament);
            }}
            disabled={isJoined || isFull}
          >
            {isJoined ? 'ALREADY JOINED' : isFull ? 'SLOTS FULL' : 'JOIN MATCH NOW'}
          </button>
        </div>
      )}
    </div>
  );
};
