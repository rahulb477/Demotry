import React from 'react';
import { Trophy, Crosshair, Calendar, ArrowRight } from 'lucide-react';
import { Tournament } from '../types';
import { EmptyState } from '../components/EmptyState';

interface MatchHistoryProps {
  tournaments: Record<string, Tournament>;
  currentUid: string;
  onNavigate: (page: string, data?: any) => void;
}

export const MatchHistory: React.FC<MatchHistoryProps> = ({
  tournaments,
  currentUid,
  onNavigate,
}) => {
  const userMatches = (Object.entries(tournaments) as [string, Tournament][])
    .filter(([_, t]) => t.participants && t.participants[currentUid])
    .sort((a, b) => (b[1].matchTime || 0) - (a[1].matchTime || 0));

  return (
    <div className="page active" id="matchHistoryPage">
      <div className="section-title">
        <span>Match History</span>
      </div>

      {userMatches.length === 0 ? (
        <EmptyState
          icon="history"
          title="No match history"
          message="You haven't participated in any tournaments yet. Join an upcoming match to get started."
        />
      ) : (
        <div className="space-y-3">
          {userMatches.map(([id, t]) => {
            const p = t.participants?.[currentUid];
            const isCompleted = t.status === 'completed';
            const isLive = t.status === 'live' || t.status === 'ongoing';
            const won = (p?.rank || 999) <= 3 || (p?.prize || 0) > 0;

            return (
              <div
                key={id}
                className="p-4 rounded-2xl border transition-all cursor-pointer hover:border-primary/50"
                style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
                onClick={() => onNavigate('tournamentDetail', id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-white">{t.name}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      isCompleted
                        ? won
                          ? 'bg-success/20 text-success'
                          : 'bg-gray-700 text-gray-300'
                        : isLive
                        ? 'bg-danger/20 text-danger animate-pulse'
                        : 'bg-primary/20 text-primary'
                    }`}
                  >
                    {isCompleted ? (won ? 'WON' : 'FINISHED') : isLive ? 'LIVE' : 'UPCOMING'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    <span>
                      {new Date(t.matchTime).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <span>{t.modeName || t.game}</span>
                </div>

                <div className="p-3 bg-white/5 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs">
                    <div>
                      <span className="text-[10px] text-gray-500 block">Rank</span>
                      <span className="font-bold text-white">#{p?.rank || '--'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 block">Kills</span>
                      <span className="font-bold text-white flex items-center gap-1">
                        <Crosshair className="w-3 h-3 text-danger" />
                        <span>{p?.kills || 0}</span>
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 block">Prize</span>
                      <span className="font-bold text-warning flex items-center gap-1">
                        <Trophy className="w-3 h-3 text-warning" />
                        <span>₹{p?.prize || 0}</span>
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
