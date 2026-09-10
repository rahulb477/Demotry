import React, { useState } from 'react';
import { Crown, PlusCircle, AlertCircle } from 'lucide-react';
import { GameMode, PremiumStatus, Tournament } from '../types';

interface CreateMatchProps {
  premium: PremiumStatus | null;
  modes: Record<string, GameMode>;
  onNavigate: (page: string) => void;
  onCreateMatch: (tourneyData: Partial<Tournament>) => Promise<void>;
}

export const CreateMatch: React.FC<CreateMatchProps> = ({
  premium,
  modes,
  onNavigate,
  onCreateMatch,
}) => {
  const isPro = premium?.active && (premium?.expiresAt || 0) > Date.now();

  const [name, setName] = useState('');
  const [modeId, setModeId] = useState(Object.keys(modes)[0] || 'mode_1');
  const [type, setType] = useState<'Solo' | 'Duo' | 'Squad'>('Solo');
  const [map, setMap] = useState('Bermuda');
  const [maxSlots, setMaxSlots] = useState(48);
  const [entryFee, setEntryFee] = useState(20);
  const [prizePool, setPrizePool] = useState(600);
  const [perKill, setPerKill] = useState(10);
  const [matchTime, setMatchTime] = useState('');
  const [rules, setRules] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isPro) {
    return (
      <div className="page active" id="createMatchPage">
        <div className="section-title">
          <span>Host Tournament</span>
        </div>
        <div
          className="p-6 rounded-2xl text-center border mt-6"
          style={{ background: 'var(--card)', borderColor: 'var(--warning)' }}
        >
          <div className="w-16 h-16 rounded-full bg-warning/20 border border-warning/40 flex items-center justify-center mx-auto mb-3">
            <Crown className="w-8 h-8 text-warning" />
          </div>
          <h3 className="font-extrabold text-lg text-white mb-2">Premium Feature Locked</h3>
          <p className="text-xs text-gray-400 mb-6 leading-relaxed">
            Hosting custom tournaments with custom entry fees and room access is reserved for BattleZone VIP Pass holders.
          </p>
          <button className="btn btn-primary" onClick={() => onNavigate('premium')}>
            Upgrade to Premium Pass
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      const selectedMode = modes[modeId];
      const matchTimestamp = matchTime ? new Date(matchTime).getTime() : Date.now() + 4 * 3600000;
      await onCreateMatch({
        name: name.trim(),
        game: 'Free Fire',
        modeId,
        modeName: selectedMode?.name || 'Battle Royale',
        type,
        map,
        maxSlots: Number(maxSlots),
        filledSlots: 0,
        entryFee: Number(entryFee),
        prizePool: Number(prizePool),
        perKillPrize: Number(perKill),
        matchTime: matchTimestamp,
        status: 'upcoming',
        visibility: 'public',
        bannerUrl: selectedMode?.image || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
        rules: rules.trim() || 'Standard fair play rules apply.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page active" id="createMatchPage">
      <div className="section-title">
        <span>Host Custom Tournament</span>
      </div>

      <div className="p-4 rounded-2xl mb-6" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label className="text-xs font-semibold text-gray-300 mb-1 block">Tournament Title</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Pro Solo Kill Feast #105"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="form-group">
              <label className="text-xs font-semibold text-gray-300 mb-1 block">Game Mode</label>
              <select
                className="form-input"
                value={modeId}
                onChange={(e) => setModeId(e.target.value)}
              >
                {(Object.entries(modes) as [string, GameMode][]).map(([id, m]) => (
                  <option key={id} value={id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="text-xs font-semibold text-gray-300 mb-1 block">Match Type</label>
              <select
                className="form-input"
                value={type}
                onChange={(e) => setType(e.target.value as any)}
              >
                <option value="Solo">Solo</option>
                <option value="Duo">Duo</option>
                <option value="Squad">Squad</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="form-group">
              <label className="text-xs font-semibold text-gray-300 mb-1 block">Map</label>
              <input
                type="text"
                className="form-input"
                value={map}
                onChange={(e) => setMap(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="text-xs font-semibold text-gray-300 mb-1 block">Max Slots</label>
              <input
                type="number"
                className="form-input"
                value={maxSlots}
                onChange={(e) => setMaxSlots(Number(e.target.value))}
                min={2}
                max={100}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="form-group">
              <label className="text-[11px] font-semibold text-gray-300 mb-1 block">Entry Fee (₹)</label>
              <input
                type="number"
                className="form-input font-mono"
                value={entryFee}
                onChange={(e) => setEntryFee(Number(e.target.value))}
                min={0}
                required
              />
            </div>
            <div className="form-group">
              <label className="text-[11px] font-semibold text-gray-300 mb-1 block">Prize Pool (₹)</label>
              <input
                type="number"
                className="form-input font-mono"
                value={prizePool}
                onChange={(e) => setPrizePool(Number(e.target.value))}
                min={0}
                required
              />
            </div>
            <div className="form-group">
              <label className="text-[11px] font-semibold text-gray-300 mb-1 block">Per Kill (₹)</label>
              <input
                type="number"
                className="form-input font-mono"
                value={perKill}
                onChange={(e) => setPerKill(Number(e.target.value))}
                min={0}
                required
              />
            </div>
          </div>

          <div className="form-group mb-3">
            <label className="text-xs font-semibold text-gray-300 mb-1 block">Match Scheduled Time</label>
            <input
              type="datetime-local"
              className="form-input"
              value={matchTime}
              onChange={(e) => setMatchTime(e.target.value)}
              required
            />
          </div>

          <div className="form-group mb-4">
            <label className="text-xs font-semibold text-gray-300 mb-1 block">Custom Rules (Optional)</label>
            <textarea
              className="form-input h-20 resize-none text-xs"
              placeholder="Enter special weapon or room restrictions..."
              value={rules}
              onChange={(e) => setRules(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <div className="spinner" /> : <span>Publish Tournament</span>}
          </button>
        </form>
      </div>
    </div>
  );
};
