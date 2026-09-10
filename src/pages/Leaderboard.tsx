import React, { useState } from 'react';
import { Crown, Trophy, Share2, Medal } from 'lucide-react';
import { LeaderboardPlayer, Tournament } from '../types';
import { Modal } from '../components/Modal';

interface LeaderboardProps {
  globalPlayers: LeaderboardPlayer[];
  tournaments: Record<string, Tournament>;
  currentUid: string;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  globalPlayers,
  tournaments,
  currentUid,
}) => {
  const [selectedTourneyId, setSelectedTourneyId] = useState<string>('global');
  const [selectedPlayer, setSelectedPlayer] = useState<LeaderboardPlayer | null>(null);

  // Derive players list based on selected tourney or global
  let playerList: LeaderboardPlayer[] = [];

  if (selectedTourneyId === 'global') {
    playerList = [...globalPlayers].sort((a, b) => b.score - a.score);
  } else {
    const tr = tournaments[selectedTourneyId];
    if (tr && tr.participants) {
      playerList = Object.entries(tr.participants).map(([uid, p]: [string, any]) => ({
        uid,
        name: p.name || 'Player',
        img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        score: p.prize || (p.kills ? p.kills * 10 : 0),
        meta: `${p.kills || 0} Kills ${p.prize ? `• ₹${p.prize}` : ''}`,
        rank: p.rank,
      }));
      playerList.sort((a, b) => (a.rank || 999) - (b.rank || 999));
    }
  }

  // Normalize ranks
  playerList = playerList.map((p, i) => ({ ...p, rank: p.rank || i + 1 }));

  const first = playerList[0];
  const second = playerList[1];
  const third = playerList[2];
  const rest = playerList.slice(3);

  const handleSharePlayer = (player: LeaderboardPlayer) => {
    const text = `BattleZone X Hall of Fame:\nPlayer: ${player.name}\nRank: #${player.rank}\nWinnings: ₹${player.score}\nCompete on BattleZone: https://battlezone-x7.onrender.com`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="page active" id="leaderboardPage">
      <div className="section-title">
        <span>Leaderboard & Rankings</span>
      </div>

      <div className="form-group mb-5">
        <select
          className="form-input"
          value={selectedTourneyId}
          onChange={(e) => setSelectedTourneyId(e.target.value)}
        >
          <option value="global">Global Hall of Fame (Top Earners)</option>
          {(Object.entries(tournaments) as [string, Tournament][])
            .filter(([_, t]) => t.status === 'completed' || Object.keys(t.participants || {}).length > 0)
            .map(([id, t]) => (
              <option key={id} value={id}>
                {t.name}
              </option>
            ))}
        </select>
      </div>

      {/* 3D Podium Container */}
      <div className="podium-container mb-6">
        {/* 2nd Place */}
        {second ? (
          <div
            className="podium-col rank-2"
            onClick={() => setSelectedPlayer(second)}
          >
            <div className="podium-avatar-wrap">
              <img src={second.img} alt={second.name} className="podium-avatar" />
              <div className="podium-crown silver">
                <Medal className="w-4 h-4 text-gray-300" />
              </div>
            </div>
            <div className="podium-name">{second.name}</div>
            <div className="podium-score">₹{second.score}</div>
            <div className="podium-stand silver">2</div>
          </div>
        ) : (
          <div className="podium-col rank-2" />
        )}

        {/* 1st Place */}
        {first ? (
          <div
            className="podium-col rank-1"
            onClick={() => setSelectedPlayer(first)}
          >
            <div className="podium-avatar-wrap">
              <img src={first.img} alt={first.name} className="podium-avatar" />
              <div className="podium-crown gold">
                <Crown className="w-5 h-5 text-warning" />
              </div>
            </div>
            <div className="podium-name">{first.name}</div>
            <div className="podium-score text-warning font-bold">₹{first.score}</div>
            <div className="podium-stand gold">1</div>
          </div>
        ) : (
          <div className="podium-col rank-1" />
        )}

        {/* 3rd Place */}
        {third ? (
          <div
            className="podium-col rank-3"
            onClick={() => setSelectedPlayer(third)}
          >
            <div className="podium-avatar-wrap">
              <img src={third.img} alt={third.name} className="podium-avatar" />
              <div className="podium-crown bronze">
                <Medal className="w-4 h-4 text-amber-600" />
              </div>
            </div>
            <div className="podium-name">{third.name}</div>
            <div className="podium-score">₹{third.score}</div>
            <div className="podium-stand bronze">3</div>
          </div>
        ) : (
          <div className="podium-col rank-3" />
        )}
      </div>

      {/* Rest of Leaderboard list */}
      <div className="space-y-2">
        {rest.map((p) => {
          const isMe = p.uid === currentUid;
          return (
            <div
              key={p.uid + p.rank}
              className={`leaderboard-item ${isMe ? 'highlight-me' : ''}`}
              onClick={() => setSelectedPlayer(p)}
            >
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-sm text-gray-400 w-6 text-center">
                  #{p.rank}
                </span>
                <img src={p.img} alt={p.name} className="w-9 h-9 rounded-full object-cover" />
                <div>
                  <div className="font-bold text-sm text-white">{p.name}</div>
                  <div className="text-[11px] text-gray-400">{p.meta}</div>
                </div>
              </div>
              <div className="font-mono font-bold text-sm text-warning">₹{p.score}</div>
            </div>
          );
        })}
      </div>

      {/* Share / Details Modal */}
      <Modal isOpen={!!selectedPlayer} onClose={() => setSelectedPlayer(null)}>
        {selectedPlayer && (
          <div className="text-center p-4">
            <div className="w-20 h-20 rounded-full mx-auto mb-3 border-2 border-primary overflow-hidden">
              <img
                src={selectedPlayer.img}
                alt={selectedPlayer.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-center justify-center gap-1 mb-1">
              <Trophy className="w-5 h-5 text-warning" />
              <h3 className="font-black text-lg text-white">{selectedPlayer.name}</h3>
            </div>
            <p className="text-xs text-gray-400 mb-4">
              Rank #{selectedPlayer.rank} • Total Earnings: ₹{selectedPlayer.score}
            </p>

            <button
              className="btn btn-primary flex items-center justify-center gap-2 mb-2"
              onClick={() => handleSharePlayer(selectedPlayer)}
            >
              <Share2 className="w-4 h-4" />
              <span>Share Performance on WhatsApp</span>
            </button>
            <button className="btn btn-secondary" onClick={() => setSelectedPlayer(null)}>
              Close
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};
