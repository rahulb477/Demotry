import React, { useState } from 'react';
import { Upload, FileCheck, Info } from 'lucide-react';
import { Tournament } from '../types';
import { uploadImage } from '../services/api';

interface ScreenshotSubmitProps {
  tournaments: Record<string, Tournament>;
  currentUid: string;
  onSubmitResult: (data: {
    matchId: string;
    matchName: string;
    rank: number;
    kills: number;
    screenshotUrl: string;
  }) => Promise<void>;
}

export const ScreenshotSubmit: React.FC<ScreenshotSubmitProps> = ({
  tournaments,
  currentUid,
  onSubmitResult,
}) => {
  // Tournaments where the user participated
  const joinedTournaments = (Object.entries(tournaments) as [string, Tournament][]).filter(
    ([_, t]) => t.participants && t.participants[currentUid]
  );

  const [selectedMatchId, setSelectedMatchId] = useState(joinedTournaments[0]?.[0] || '');
  const [rank, setRank] = useState(1);
  const [kills, setKills] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(f);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMatchId) {
      alert('Please select a match you participated in');
      return;
    }
    if (!file) {
      alert('Please attach your match ending score screenshot');
      return;
    }
    setLoading(true);
    try {
      const shotUrl = await uploadImage(file);
      const matchName = tournaments[selectedMatchId]?.name || 'Match';
      await onSubmitResult({
        matchId: selectedMatchId,
        matchName,
        rank: Number(rank),
        kills: Number(kills),
        screenshotUrl: shotUrl,
      });
      setFile(null);
      setPreview(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page active" id="screenshotSubmitPage">
      <div className="section-title">
        <span>Submit Match Result</span>
      </div>

      <div className="p-4 rounded-2xl mb-6" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label className="text-xs font-semibold text-gray-300 mb-1 block">Select Tournament</label>
            {joinedTournaments.length === 0 ? (
              <p className="text-xs text-warning py-2">
                You have not registered in any matches yet. Join a match from Home or Tournaments to submit results.
              </p>
            ) : (
              <select
                className="form-input"
                value={selectedMatchId}
                onChange={(e) => setSelectedMatchId(e.target.value)}
                required
              >
                {joinedTournaments.map(([id, t]) => (
                  <option key={id} value={id}>
                    {t.name} ({t.status.toUpperCase()})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="form-group">
              <label className="text-xs font-semibold text-gray-300 mb-1 block">Final Rank</label>
              <input
                type="number"
                className="form-input"
                value={rank}
                onChange={(e) => setRank(Number(e.target.value))}
                min={1}
                max={100}
                required
              />
            </div>
            <div className="form-group">
              <label className="text-xs font-semibold text-gray-300 mb-1 block">Kills Achieved</label>
              <input
                type="number"
                className="form-input"
                value={kills}
                onChange={(e) => setKills(Number(e.target.value))}
                min={0}
                required
              />
            </div>
          </div>

          <div className="form-group mb-4">
            <label className="text-xs font-semibold text-gray-300 mb-1 block">
              Match End Screen / Scoreboard Screenshot
            </label>
            <label className="border-2 border-dashed border-white/10 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
              <Upload className="w-6 h-6 text-gray-400 mb-2" />
              <span className="text-xs text-gray-400">
                {file ? file.name : 'Click to select clear screenshot'}
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                required
              />
            </label>
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="w-full max-h-48 object-cover rounded-lg mt-2 border border-white/10"
              />
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || joinedTournaments.length === 0}
          >
            {loading ? <div className="spinner" /> : <span>Submit for Admin Verification</span>}
          </button>
        </form>
      </div>

      <div className="p-4 rounded-xl flex items-start gap-3 bg-white/5 border border-white/10">
        <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div className="text-xs text-gray-300 leading-relaxed">
          Ensure your in-game name and final kills are clearly visible in the screenshot. Submitting fraudulent or doctored screenshots will lead to permanent wallet forfeiture and account suspension.
        </div>
      </div>
    </div>
  );
};
